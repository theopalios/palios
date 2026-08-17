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

## Custom domain (optional, later)

```bash
gcloud beta run domain-mappings create --service palios-site --region europe-west4 --domain yourdomain.com
```

Add the DNS records it prints at your registrar, then set `site: 'https://yourdomain.com'` in
`astro.config.mjs` and redeploy so canonical URLs are emitted.

## Notes

- The container listens on port 8080 (Cloud Run's default `PORT`); hashed assets under
  `/_astro/` are cached immutably; 404s serve the styled `404.html`.
- Nothing about the site requires Cloud Run specifically — `dist/` is plain static output and
  can be hosted anywhere that serves files.
