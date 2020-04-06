import { shape, func } from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import '../../common/scheema/Scheema.scss';
import propType from '../../i18n/propType';
import AddressFieldset from '../common/form/AddressFieldset';
import EmailField from '../common/form/EmailField';
import Form from '../common/form/Form';
import PhoneNumberField from '../common/form/PhoneNumberField';
import PageHeader from '../common/PageHeader';
import FormButtonGroup from '../common/buttons/FormButtonGroup';
import SubmitButton from '../common/buttons/SubmitButton';
import CancelButton from '../common/buttons/CancelButton';


class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    const { initialize } = this.props;
    const formData = this.getInitialValues();
    initialize(formData);
  }

  getInitialValues() {
    const { userData } = this.props;

    const formData = {};
    formData.phone = userData.contact.phone;
    formData.email = userData.contact.email;

    formData.visitAddressLine1 = userData.selectedCompany.visitAddressLine1;
    formData.visitAddressLine2 = userData.selectedCompany.visitAddressLine2;
    formData.visitAddressPostCode = userData.selectedCompany.visitAddressPostCode;
    formData.visitAddressCity = userData.selectedCompany.visitAddressCity;

    formData.postAddressLine1 = userData.selectedCompany.postAddressLine1;
    formData.postAddressLine2 = userData.selectedCompany.postAddressLine2;
    formData.postAddressPostCode = userData.selectedCompany.postAddressPostCode;
    formData.postAddressCity = userData.selectedCompany.postAddressCity;

    formData.billAddressLine1 = userData.selectedCompany.billAddressLine1;
    formData.billAddressLine2 = userData.selectedCompany.billAddressLine2;
    formData.billAddressPostCode = userData.selectedCompany.billAddressPostCode;
    formData.billAddressCity = userData.selectedCompany.billAddressCity;
    return formData;
  }

  getPostContract(values) {
    const { userData } = this.props;

    return {
      contact: {
        id: userData.contact.id,
        email: values.email,
        phone: values.phone,
        customerNumber: userData.contact.customerNumber,
      },
      company: {
        id: userData.selectedCompany.id,
        organisationNumber: userData.selectedCompany.organisationNumber,
        name: userData.selectedCompany.name,
        visitAddressLine1: values.visitAddressLine1,
        visitAddressLine2: values.visitAddressLine2,
        visitAddressPostCode: values.visitAddressPostCode,
        visitAddressCity: values.visitAddressCity,

        postAddressLine1: values.postAddressLine1,
        postAddressLine2: values.postAddressLine2,
        postAddressPostCode: values.postAddressPostCode,
        postAddressCity: values.postAddressCity,

        billAddressLine1: values.billAddressLine1,
        billAddressLine2: values.billAddressLine2,
        billAddressPostCode: values.billAddressPostCode,
        billAddressCity: values.billAddressCity,
      },
    };
  }

  submit(values) {
    const { actions } = this.props;
    const contract = this.getPostContract(values);
    actions.updateProfile(contract);
  }

  render() {
    const { handleSubmit, language } = this.props;

    return (
      <div className="customer-form">
        <PageHeader>{language.pages.profile.title}</PageHeader>
        <Form onSubmit={handleSubmit(this.submit)}>
          <PhoneNumberField name="phone" label={language.formFields.phone} required />
          <EmailField name="email" label={language.formFields.email} required />
          <AddressFieldset namePrefix="visit" legend={language.formFields.visitAddress} />
          <AddressFieldset namePrefix="post" legend={language.formFields.postAddress} />
          <AddressFieldset namePrefix="bill" legend={language.formFields.billAddress} />

          <FormButtonGroup>
            <SubmitButton text={language.formFields.save} />
            <CancelButton />
          </FormButtonGroup>
        </Form>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  initialize: func.isRequired,
  handleSubmit: func.isRequired,
  userData: shape({}).isRequired,
  language: propType.isRequired,
  actions: shape({
    updateProfile: func.isRequired,
  }).isRequired,
};

export default reduxForm({ form: 'profileFormConfiguration' })(ProfileForm);
