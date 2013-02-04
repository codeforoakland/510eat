import os, sys
sys.path.append('/home/bitnami/github')
sys.path.append('/home/bitnami/github/510eat/')
sys.path.append('/home/bitnami/github/510eat/fiveoneoheat')
sys.path.append('/home/bitnami/github/510eat/fiveoneoheat/fiveoneoheat')
os.environ['DJANGO_SETTINGS_MODULE'] = 'fiveoneoheat.settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()