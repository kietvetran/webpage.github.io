export const ProfileScheema = {
  'type'   : 'simple',
  'headline': '', // not in use jet
  'leadText': '', // not in use jet
  'formName': 'profileScheema',
  'content': [
    {
      /*
      'id'          : 'customerNumber',
      'name'        : 'customerNumber',
      'type'        : 'telfield',
      'label'       : 'Kundenummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-customer-number',
      'maxLength'   : 40,
      'readOnly'    : 1,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Kundenummer er påkrevd'
        }
      ]
    }, {
      'id'          : 'company',
      'name'        : 'company',
      'type'        : 'textfield',
      'label'       : 'Selskap',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-company',
      'maxLength'   : 70,
      'readOnly'    : 1,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Selskap er påkrevd'
        }, {
          'regex' : /^((?!.{2,}).)*$/,
          'message': 'Selskap må minimum lengde 2 bokstaver'
        }
      ]
    }, {
      'id'          : 'organizationNumber',
      'name'        : 'organisationNumber',
      'type'        : 'telfield',
      'label'       : 'Organisasjonsnummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-orginazation-number',
      'maxLength'   : 40,
      'readOnly'    : 1,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Organisasjonsnummer er påkrevd'
        }, {
          'rule'   : 'organization-number',
          'message': 'Organisasjonsnummer er ugyldig'
        }
      ],
      'validation': null
    /*
    }, {
      'id'          : 'firstName',
      'name'        : 'firstName',
      'type'        : 'textfield',
      'label'       : 'Fornavn',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-firstname',
      'maxLength'   : 70,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Fornavn er påkrevd'
        }, {
          'regex' : /^((?!.{2,}).)*$/,
          'message': 'Fornavn må minimum lengde 2 bokstaver'
        }
      ]
    }, {
      'id'          : 'lastName',
      'name'        : 'lastName',
      'type'        : 'textfield',
      'label'       : 'Etternavn',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-lastname',
      'maxLength'   : 70,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Etternavn er påkrevd'
        }, {
          'regex' : /^((?!.{2,}).)*$/,
          'message': 'Etternavn må minimum lengde 2 bokstaver'
        }
      ]
    }, {
      'id'          : 'countryCode',
      'name'        : 'countryCode',
      'type'        : 'selection',
      'label'       : 'Landkode',
      'defaultValue': '',
      'wrapperStyle': '-country-code',
      'selection'   : PhoneCountryCodeNB
    }, {
      'id'          : 'phone',
      'name'        : 'phone',
      'type'        : 'telfield',
      'label'       : 'Telefonnummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      //'format'      : 'phone',
      'wrapperStyle': '-phone',
      'maxLength'   : 40,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Telefonnummer er påkrevd'
        }, {
          'rule'   : 'telephone',
          'message': 'Telefonnummer er ugyldig'
        }
      ]
    }, {
      'id'          : 'email',
      'name'        : 'email',
      'type'        : 'email',
      'label'       : 'E-postadresse',
      'required'    : true,
      'wrapperStyle': '-email',
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'E-postadresse er påkrevd'
        }, {
          'rule'   : 'email',
          'message': 'E-postadresse adresse er ugyldig'
        }
      ]
    }, {
      'id'          : 'comment',
      'name'        : 'comment',
      'type'        : 'textarea',
      'label'       : 'Kommentar',
      'wrapperStyle': '-comment',
      'maxLength'   : 300,
      'remainCharacterText': 'Gjenstår antall tegn'
    */

      'id'          : 'countryCode',
      'name'        : 'countryCode',
      'type'        : 'selection',
      'label'       : 'Landkode',
      'defaultValue': '',
      'wrapperStyle': '-country-code',
      'selection'   : [
        {'id': '+47', 'name': '+47 Norge'},
        {'id': '+46', 'name': '+46 Danmark'},
        {'id': '+45', 'name': '+45 Sverige'},
        {'id': '+44', 'name': '+44 Finland'},
      ]
    }
  ]
}