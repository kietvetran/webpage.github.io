export const ProfileDataList = [
	{
    'type' : 'field',
    'title': 'Fullame',
    'name' : 'name',
    'value': '',
    'validation': [
      {'rule': 'required', 'message': 'The name is required' }
    ]
	}, {
    'type' : 'field',
    'title': 'Email',
    'name' : 'email',
    'value': '',
    'validation': [
      {'rule': 'email', 'message': 'The email is invalid' }
    ]
	}, {
    'type' : 'field',
    'title': 'Phone',
    'name' : 'phone',
    'value': '',
    'format': 'phone',
    'validation': [
      {'rule': 'phone', 'message': 'The phone number is incorrect' }
    ]
	}, {
    'type' : 'field',
    'title': 'Amount',
    'name' : 'amount',
    'value': '',
    'format': 'amount',
    'validation': [
      {'rule': 'amount', 'message': 'The field is incorrect' }
    ]
	}, {
    'type' : 'selection',
    'title': 'Friend',
    'name' : 'friend',
    'value': '',
    'validation': [
    ]
  }, {
    'type' : 'selection',
    'title': 'Inviation',
    'name' : 'invitation',
    'value': '',
    'validation': [
    ]
  }
];