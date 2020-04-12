export const ProfileWizardScheema = {
  'headline': '', // not in use jet
  'leadText': '', // not in use jet
  'formName': 'profileScheema',
  'wizard'  : 'left',
  'content': [
    {
      'title': 'My first step',
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
        }
      ]
    }, {
      'title': 'My second step',
      'content': [
        {
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