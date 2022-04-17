import json
import os

from elementalcms import Elemental, ElementalContext
from elementalcms.core import FlaskContext, MongoDbContext
from flask import Flask

www = Flask(__name__, template_folder='templates', static_folder='static')

CONFIG_FILE_NAME = os.environ.get('CONFIG_FILE_NAME', 'settings/debug.json')

with open(CONFIG_FILE_NAME) as config_file:
    settings = json.load(config_file)
    cms_core_context = FlaskContext(settings['cmsCoreContext'])
    cms_db_context = MongoDbContext(settings['cmsDbContext'])
    elemental_context = ElementalContext(cms_core_context, cms_db_context)

Elemental(www, elemental_context)


if __name__ == '__main__':
    www.run(host='0.0.0.0', port=8000)

