# Getting Started

Basic sample to get you started right away !

## After clonning this repo

You should be able to run the web portal by issuing the following commands:

### Setup requirements

```bash
pip install -r requirements.txt
```

### Push and publish the pages located at workspace/pages/en

```bash
elemental-cms pages push -p home en && \
elemental-cms pages push -p home/child en && \
elemental-cms pages publish -p home en && \
elemental-cms pages publish -p home/child en
```

### Run the app

```bash
python main.py
```
