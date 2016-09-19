/******************************************************************************
=== CONFIGURATION ===
******************************************************************************/
var CONFIG = {
	'api': {
		'library' : '',
		'commentPush'   : 'http://sb1maler.azurewebsites.net/api/Comment/',		
		'commentList'   : 'http://sb1maler.azurewebsites.net/api/Comment/GetByElement/',
		'commentCount'  : 'http://sb1maler.azurewebsites.net/api/Comment/GetCount/',
		'authentication': 'http://sb1maler.azurewebsites.net/Account/JsonLogin/',

		'profileSearch' : 'https://merkevare.sparebank1.no/portal/doc/index.aspx?qm=1&words='
		//'statistic_visitor' : 'http://noabookdev.azurewebsites.net/?updatestatistic=sb1_statistic',
		//'statistic_data' : 'http://noabookdev.azurewebsites.net/?getstatistic=sb1_statistic'		
	},
	'featureDownload': false,
	'featureAuthentication': false,
	//'featureRating' : 0,
	'featureComment': {
		'startView': 3,
		'gapView'  : 1,
		'expanding': 5
	},
	'featureItem': {
		'startView': 16,
		'gapView'  : 4,
		'expanding': 12
	}
};
