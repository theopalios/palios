# Deploying to Google Cloud Run

The site ships as a tiny nginx container (see `Dockerfile` + `nginx.conf`) built remotely by
Cloud Build and served by **Cloud Run** in `europe-west4` (Netherlands). Costs at portfolio
traffic are ~€0 (scale to zero); you get HTTPS + a `*.run.app` URL immediately, and can map a
custom domain later.

## One-time setup

1. **Install the gcloud CLI** (skip if `gcloud --version` works):

   ```bash
   curl -fsSLo /tmp/gcloud.tgz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
   tar -xzf /tmp/gcloud.tgz -C "$HOME"
   "$HOME/google-cloud-sdk/install.sh" --quiet
   ```

2. **Sign in**:

   ```bash
   gcloud auth login
   # On a headless machine: gcloud auth login --no-launch-browser
   # (open the printed URL, approve, paste the code back)
   ```

   > Note for CI/containers: if the environment presets `CLOUDSDK_AUTH_ACCESS_TOKEN`, it
   > overrides your login — prefix commands with `env -u CLOUDSDK_AUTH_ACCESS_TOKEN` to use
   > your own credentials.

3. **Pick or create a project**, and make sure billing is linked:

   ```bash
   gcloud projects list
   gcloud projects create theo-palios-site        # if you need a new one
   gcloud config set project <PROJECT_ID>

   gcloud billing projects describe <PROJECT_ID> --format='value(billingEnabled)'
   gcloud billing accounts list                   # find an open billing account
   gcloud billing projects link <PROJECT_ID> --billing-account=<ACCOUNT_ID>
   ```

4. **Enable the needed APIs** (first deploy also offers to do this):

   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

## Deploy (every time)

From the repo root:

```bash
gcloud run deploy palios-site \
  --source . \
  --region europe-west4 \
  --allow-unauthenticated
```

Cloud Build builds the `Dockerfile` remotely (`.gcloudignore` controls the upload), pushes the
image, and Cloud Run serves it. The command prints your public
`https://palios-site-<hash>-ez.a.run.app` URL when done.

## Custom domain

Done for **palios.io** (mapping exists; `site` is set in `astro.config.mjs`):

```bash
gcloud beta run domain-mappings create --service palios-site --region europe-west4 --domain palios.io
```

The mapping requires these records on the apex (`@`) at the palios.io registrar — TLS is
auto-provisioned by Google once they resolve:

| Type | Name | Value                 |
| ---- | ---- | --------------------- |
| A    | @    | 216.239.32.21         |
| A    | @    | 216.239.34.21         |
| A    | @    | 216.239.36.21         |
| A    | @    | 216.239.38.21         |
| AAAA | @    | 2001:4860:4802:32::15 |
| AAAA | @    | 2001:4860:4802:34::15 |
| AAAA | @    | 2001:4860:4802:36::15 |
| AAAA | @    | 2001:4860:4802:38::15 |

Check status with `gcloud beta run domain-mappings describe --domain palios.io --region europe-west4`.
For `www.palios.io`, add a mapping for it too and a `CNAME www → ghs.googlehosted.com` record.

## Project notes (as deployed)

- Project `palios-site`, billing linked, APIs enabled; the default compute service account
  carries `roles/cloudbuild.builds.builder` + `roles/logging.logWriter` (fresh projects need
  both for `--source` deploys, and without the latter build failures are invisible).
- The org enforces domain-restricted sharing; project `palios-site` has a scoped org-policy
  override (`iam.allowedPolicyMemberDomains: allowAll`) so the site can be public (`allUsers`
  has `roles/run.invoker`). Every other project keeps the org restriction.

## Notes

- The container listens on port 8080 (Cloud Run's default `PORT`); hashed assets under
  `/_astro/` are cached immutably; 404s serve the styled `404.html`.
- Nothing about the site requires Cloud Run specifically — `dist/` is plain static output and
  can be hosted anywhere that serves files.
