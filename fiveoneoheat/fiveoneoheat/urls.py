from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'fiveoneoheat.views.home', name='home'),
    # url(r'^fiveoneoheat/', include('fiveoneoheat.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'fiveoneoheat.views.index',name='site_landing'),
    url(r'^index.html', 'fiveoneoheat.views.index',name='site_landing'),
    url(r'^search/name.html', 'fiveoneoheat.views.search_name',name='search_name'),
    url(r'^search/name.json', 'fiveoneoheat.views.search_name_json',name='search_name_json'),
    url(r'^map/browse.html', 'fiveoneoheat.views.map_browse',name='map_browse'),
    url(r'^map/browse.json', 'fiveoneoheat.views.map_browse_json',name='map_browse_json'),
#    url(r'^facility.html', 'fiveoneoheat.views.facility',name='facility'),

    #id based urls
    url(r'^facility/(\w+)/$', 'fiveoneoheat.views.facility_by_id', name='facility_by_id'),

)
