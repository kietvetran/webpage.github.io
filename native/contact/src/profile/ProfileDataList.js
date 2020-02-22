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
    'title': 'Phone',
    'name' : 'phone',
    'value': '97734656',
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
	}
];