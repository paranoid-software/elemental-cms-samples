# Firebase Auth Sample

Simple email / password authentication sample using Firebase javascript SDK.

This sample has 3 multi language pages:

- home (Main page)
- sign-in (Authentication page)
- sign-up (User registration page)

It also includes one snippet under the name **sign-out-plugster** which is responsible for close the user session.

## After clonning this repo

You should be able to run the web portal by issuing the following commands:

### Setup requirements

```bash
pip install -r requirements.txt
```

### Push and publish the portal artifacts by issing the following commands:

```bash
elemental-cms global-deps push --all && \
elemental-cms snippets push --all && \
elemental-cms pages push -p home en && \
elemental-cms pages publish -p home en && \
elemental-cms pages push -p sign-in en && \
elemental-cms pages publish -p sign-in en && \
elemental-cms pages push -p sign-up en && \
elemental-cms pages publish -p sign-up en && \
elemental-cms pages push -p home es && \
elemental-cms pages publish -p home es && \
elemental-cms pages push -p sign-in es && \
elemental-cms pages publish -p sign-in es && \
elemental-cms pages push -p sign-up es && \
elemental-cms pages publish -p sign-up es
```

### Run the app

```bash
python main.py
```

