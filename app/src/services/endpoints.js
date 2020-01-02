/* eslint-disable no-template-curly-in-string */
module.exports = {
    cf_viirsfiresbyiso: {
        uri: '/viirs-active-fires/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_viirsfiresbyisoandregion: {
        uri: '/viirs-active-fires/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_viirsfiresbywdpa: {
        uri: '/viirs-active-fires/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_viirsfiresbyuse: {
        uri: '/viirs-active-fires/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_viirsfiresbygeostore: {
        uri: '/viirs-active-fires',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_viirsfireslatest: {
        uri: '/viirs-active-fires/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_gladalertsbyiso: {
        uri: '/glad-alerts/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_gladalertsbyisoandregion: {
        uri: '/glad-alerts/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_gladalertsbywdpa: {
        uri: '/glad-alerts/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_gladalertsbyuse: {
        uri: '/glad-alerts/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_gladalertsbygeostore: {
        uri: '/glad-alerts',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_gladalertslatest: {
        uri: '/glad-alerts/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_guiralossbyiso: {
        uri: '/guira-loss/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_guiralossbyisoandregion: {
        uri: '/guira-loss/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_guiralossbywdpa: {
        uri: '/guira-loss/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_guiralossbyuse: {
        uri: '/guira-loss/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_guiralossbygeostore: {
        uri: '/guira-loss',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_guiralosslatest: {
        uri: '/guira-loss/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_imazonalertsbyiso: {
        uri: '/imazon-alerts/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_imazonalertsbyisoandregion: {
        uri: '/imazon-alerts/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_imazonalertsbywdpa: {
        uri: '/imazon-alerts/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_imazonalertsbyuse: {
        uri: '/imazon-alerts/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_imazonalertsbygeostore: {
        uri: '/imazon-alerts',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_imazonalertslatest: {
        uri: '/imazon-alerts/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_prodeslossbyiso: {
        uri: '/prodes-loss/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_prodeslossbyisoandregion: {
        uri: '/prodes-loss/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_prodeslossbywdpa: {
        uri: '/prodes-loss/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_prodeslossbyuse: {
        uri: '/prodes-loss/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_prodeslossbygeostore: {
        uri: '/prodes-loss',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_prodeslosslatest: {
        uri: '/prodes-loss/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_quiccalertsbyiso: {
        uri: '/quicc-alerts/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_quiccalertsbyisoandregion: {
        uri: '/quicc-alerts/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_quiccalertsbywdpa: {
        uri: '/quicc-alerts/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_quiccalertsbyuse: {
        uri: '/quicc-alerts/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_quiccalertsbygeostore: {
        uri: '/quicc-alerts',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }, {
            name: 'alertQuery',
            required: false,
            location: 'query'
        }]
    },
    cf_quiccalertslatest: {
        uri: '/quicc-alerts/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_terraialertsbyiso: {
        uri: '/terrai-alerts/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_terraialertsbyisoandregion: {
        uri: '/terrai-alerts/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_terraialertsbywdpa: {
        uri: '/terrai-alerts/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_terraialertsbyuse: {
        uri: '/terrai-alerts/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_terraialertsbygeostore: {
        uri: '/terrai-alerts',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }]
    },
    cf_terraialertslatest: {
        uri: '/terrai-alerts/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
    cf_umdlossgainbyiso: {
        uri: '/terrai-alerts/admin/${iso}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'thresh',
            required: false,
            location: 'query'
        }]
    },
    cf_umdlossgainbyisoandregion: {
        uri: '/terrai-alerts/admin/${iso}/${id1}',
        method: 'GET',
        arguments: [{
            name: 'iso',
            location: 'path',
            required: true
        }, {
            name: 'id1',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'thresh',
            required: false,
            location: 'query'
        }]
    },
    cf_umdlossgainbywdpa: {
        uri: '/terrai-alerts/wdpa/${id}',
        method: 'GET',
        arguments: [{
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'thresh',
            required: false,
            location: 'query'
        }]
    },
    cf_umdlossgainbyuse: {
        uri: '/terrai-alerts/use/${name}/${id}',
        method: 'GET',
        arguments: [{
            name: 'name',
            location: 'path',
            required: true
        }, {
            name: 'id',
            location: 'path',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'thresh',
            required: false,
            location: 'query'
        }]
    },
    cf_umdlossgainbygeostore: {
        uri: '/terrai-alerts',
        method: 'GET',
        arguments: [{
            name: 'geostore',
            location: 'query',
            required: true
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'period',
            required: false,
            location: 'query'
        }, {
            name: 'thresh',
            required: false,
            location: 'query'
        }]
    },
    cf_umdlossgainlatest: {
        uri: '/terrai-alerts/latest',
        method: 'GET',
        arguments: [{
            name: 'limit',
            location: 'query',
            required: false
        }]
    },
};
