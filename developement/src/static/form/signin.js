export const Signin = {
  'type'   : 'simple',
  'content': [
    {
      'id'          : 'username',
      'name'        : 'username',
      'type'        : 'email',
      'label'       : 'Brukernavn',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-username',
      'maxLength'   : 70,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Brukenavn er påkrevd'
        }, {
          'rule'   : 'email',
          'message': 'Brukenavn er ugyldig'
        }
      ]
    }, {
      'id'          : 'password',
      'name'        : 'password',
      'type'        : 'password',
      'label'       : 'Passord',
      'defaultValue': '',
      'placeholder' : '',
      'required'    : true,
      'wrapperStyle': '-password',
      'maxLength'   : 70,
      'validation'  : [
        {
          'rule'   : 'required',
          'message': 'Passord er påkrevd'
        }
      ]
    }
  ]
}