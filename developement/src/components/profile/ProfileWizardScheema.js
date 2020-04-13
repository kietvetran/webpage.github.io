export const ProfileWizardScheema = {
  'headline': '', // not in use jet
  'leadText': '', // not in use jet
  'formName': 'profileScheema',
  'wizard'  : 'right',
  'content': [
    {
    /*
      'title': 'Familie',
      'content': [
        {      
          'id'          : 'relationship',
          'name'        : 'relationship',
          'type'        : 'radio',
          'labels'      : ['Gift','Samboer','Enslig'],
          'values'      : ['married','cohabitant','single'],
          'legend'      : 'Sivilstatus',
          'wrapperStyle': '-relationship',
          'listStyle'   : '-inline',
          'inputStyle'  : '-box',
          'required'    : true,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Sivilstatus er påkrevd'
            }
          ]
        }, {
          'id'          : 'children',
          'name'        : 'children',
          'type'        : 'radio',
          'labels'      : ['Ingen','1','2','3','4+'],
          'values'      : ['0','1','2','3','4+'],
          'legend'      : 'Barn under 18 år',
          'wrapperStyle': '-children',
          'listStyle'   : '-inline',
          'inputStyle'  : '-box', 
          'required'    : true,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Valget er påkrevd'
            }
          ]          
        }
      ]
    }, {
      'title': 'Inntekt',
      'content': [
        {
          'id'          : 'your-income',
          'name'        : 'yourIncome',
          'type'        : 'telfield',
          'label'       : 'Lønn',
          'defaultValue': '',
          'placeholder' : '',
          'unit'        : 'Kr',
          'required'    : true,
          'wrapperStyle': '-your-income',
          'format'      : 'amount',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Lønn er påkrevd'
            }, {
              'rule' : 'amount',
              'message': 'Lønn er ugyldig'
            }
          ]
        }, {
          'id'          : 'partner-income',
          'name'        : 'partnerIncome',
          'type'        : 'telfield',
          'label'       : 'Ektefelle / Samboer lønn',
          'defaultValue': '',
          'placeholder' : '',
          'unit'        : 'Kr',
          'required'    : true,
          'wrapperStyle': '-partner-income',
          'format'      : 'amount',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Ektefelle / Samboer lønn er påkrevd'
            }, {
              'rule' : 'amount',
              'message': 'Ektefelle / Samboer lønn er ugyldig'
            }
          ]          
        }, {
          'id'          : 'other-income',
          'name'        : 'otherIncome',
          'type'        : 'telfield',
          'label'       : 'Annen årlig inntekt',
          'description' : 'For eksempel airBnB, nobobil, utleie osv.',
          'defaultValue': '',
          'placeholder' : '',
          'unit'        : 'Kr',
          'wrapperStyle': '-other-income',
          'format'      : 'amount',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule' : 'amount',
              'message': 'Annen årlig inntekt er ugyldig'
            }
          ]          
        }
      ]
    }, {
    */
      'title': 'Bolig lån',
      'content': [
        {
          'id'          : 'mortgage',
          'name'        : 'mortgage',
          'type'        : 'telfield',
          'label'       : 'Lånesum',
          'unit'        : 'Kr',
          'wrapperStyle': '-mortgage',
          'format'      : 'amount',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule' : 'amount',
              'message': 'Lånesum er ugyldig'
            }
          ]
        }, {
          'id'          : 'housing-value',
          'name'        : 'housingValue',
          'type'        : 'telfield',
          'label'       : 'Boligverdi',
          'unit'        : 'Kr',
          'wrapperStyle': '-housing-value',
          'format'      : 'amount',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule' : 'amount',
              'message': 'Boligverdi er ugyldig'
            }
          ]
        }, {
          'id'          : 'interest',
          'name'        : 'interest',
          'type'        : 'telfield',
          'label'       : 'Rente',
          'defaultValue': '2,8',
          'unit'        : '%',
          'wrapperStyle': '-interest',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Gjenstående terminer er påkrevd',
              'dependent': ['mortgage'],
            }, {
              'rule' : 'amount',
              'message': 'Rente er ugyldig'
            }
          ]
        }, {
          'id'          : 'remaining-futures',
          'name'        : 'remainingFutures',
          'type'        : 'telfield',
          'label'       : 'Gjenstående terminer',
          'defaultValue': '20',
          'unit'        : 'stk',
          'wrapperStyle': '-remaining-futures',
          'maxLength'   : 40,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Gjenstående terminer er påkrevd',
              'dependent': ['mortgage'],
            }, {
              'rule' : 'amount',
              'message': 'Rente er ugyldig'
            }
          ]
        }, {
          'id'          : 'payment-type',
          'name'        : 'paymentType',
          'type'        : 'radio',
          'labels'      : ['Annuitet','Serielån'],
          'values'      : ['0','1'],
          'legend'      : 'Betalingstype',
          'wrapperStyle': '-payment-type',
          'listStyle'   : '-inline',
          'inputStyle'  : '-box', 
          'required'    : true,
          'validation'  : [
            {
              'rule'   : 'required',
              'message': 'Valget er påkrevd',
              'dependent': ['mortgage'],
            }
          ]
        }
      ]
    }, {
      'title': 'My first step',
      'content': [
        {
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
  ]
}