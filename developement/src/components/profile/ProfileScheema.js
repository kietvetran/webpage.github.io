export const ProfileScheema = {
  'headline': '', // not in use jet
  'leadText': '', // not in use jet
  'formName': 'profileScheema',
  'content': [
    {      
      'id'          : 'phone',
      'name'        : 'phone',
      'type'        : 'telfield',
      'label'       : 'Telefonnummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'format'      : 'phone',
      'wrapperStyle': '-phone',
      'maxLength'   : 40,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Telefonnummer er påkrevd'
        }, {
          'rule'   : 'phone',
          'message': 'Telefonnummer er ugyldig'
        }
      ]
    }, {
      'id'          : 'amount',
      'name'        : 'amount',
      'type'        : 'telfield',
      'label'       : 'Beløp',
      'defaultValue': '',
      'placeholder' : '',
      'unit'        : 'Kr',
      'required'    : true,
      'wrapperStyle': '-amount',
      'format'      : 'amount',
      'maxLength'   : 40,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Beløpet er påkrevd'
        }, {
          'rule' : 'amount',
          'message': 'Beløpet er ugyldig'
        }
      ]
    }, {
      'id'          : 'customerNumber',
      'name'        : 'customerNumber',
      'type'        : 'telfield',
      'label'       : 'Kundenummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-customer-number',
      'maxLength'   : 40,
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
      'id'          : 'personId',
      'name'        : 'personId',
      'type'        : 'telfield',
      'label'       : 'Fødselsnummer',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-person-id',
      'maxLength'   : 12,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Fødselsnummer er påkrevd'
        }, {
          'rule'   : 'person-id',
          'message': 'Fødselsnummer er ugyldig'
        }
      ]
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
      'id'          : 'countryCode',
      'name'        : 'countryCode',
      'type'        : 'select',
      'label'       : 'Landkode',
      'defaultValue': '',
      'wrapperStyle': '-country-code',
      'selection'   : [
        {'id': '+47', 'name': '+47 Norge'},
        {'id': '+46', 'name': '+46 Danmark'},
        {'id': '+45', 'name': '+45 Sverige'},
        {'id': '+44', 'name': '+44 Finland'}
      ]
    }, {
      'id'          : 'statement',
      'name'        : 'statement',
      'type'        : 'checkbox',
      'label'       : 'Jeg erklærer at informasjonen jeg har oppgitt er riktig.',
      'legend'      : 'Samtykke',
      'defaultValue': '',
      'wrapperStyle': '-statement',
      'required'    : true,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Du må bekrefte at informasjonen du har oppgitt er riktig',
        }
      ]
    }, {
      'id'          : 'expired-date',
      'name'        : 'expiredDate',
      'type'        : 'radio',
      'labels'      : ['Internt','Standard','Krise','Katastrofe'],
      'values'      : ['level1','level2','level3','level4'],
      'legend'      : 'Avsluttsdato',
      'wrapperStyle': '-expired-date',
      'required'    : true,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Avsluttsdato er påkrevd'
        }
      ]
    }, {
      'id'          : 'comment',
      'name'        : 'comment',
      'type'        : 'textarea',
      'label'       : 'Kommentar',
      'wrapperStyle': '-comment',
      'maxLength'   : 300,
      'remainCharacterText': 'Gjenstår antall tegn',
    }
  ]
}