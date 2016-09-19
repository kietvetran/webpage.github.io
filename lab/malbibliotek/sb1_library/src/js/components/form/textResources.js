var configRepo = require("configrepo");
var user = configRepo("user");

var nb = {},
    nn = {},
    en = {};

nb.COMMON_OPTION_YES = "Ja";
nn.COMMON_OPTION_YES = "Ja";
en.COMMON_OPTION_YES = "Yes";

nb.COMMON_OPTION_NO = "Nei";
nn.COMMON_OPTION_NO = "Nei";
en.COMMON_OPTION_NO = "No";

nb.COMMON_OPTION_SAVE = "Lagre";
nn.COMMON_OPTION_SAVE = "Lagre";
en.COMMON_OPTION_SAVE = "Save";

nb.COMMON_OPTION_CANCEL = "Angre";
nn.COMMON_OPTION_CANCEL = "Angre";
en.COMMON_OPTION_CANCEL = "Cancel";

nb.REMOVE_FILE = "Fjern fil";
nn.REMOVE_FILE = "Fjern fil";
en.REMOVE_FILE = "Remove file";

nb.CHOOSE_FILE = "Last opp fil";
nn.CHOOSE_FILE = "Last opp fil";
en.CHOOSE_FILE = "Upload file";

nb.SUMMARY_HEADLINE = "Bekreft opplysninger";
nn.SUMMARY_HEADLINE = "Bekreft opplysningar";
en.SUMMARY_HEADLINE = "Confirm information";

nb.CHECKBOX_OPTION_YES = "Ja";
nn.CHECKBOX_OPTION_YES = "Ja";
en.CHECKBOX_OPTION_YES = "Yes";

nb.CHECKBOX_OPTION_NO = "Nei";
nn.CHECKBOX_OPTION_NO = "Nei";
en.CHECKBOX_OPTION_NO = "No";


nb.ABORT = "Avbryt";
nn.ABORT = "Avbryt";
en.ABORT = "Cancel";

nb.BACK = "Tilbake";
nn.BACK = "Tilbake";
en.BACK = "Back";

nb.CONFIRM = "Bekreft";
nn.CONFIRM = "Bekreft";
en.CONFIRM = "Confirm";

nb.COMPANY_PLACEHOLDER = "Søk på selskap eller org. nr";
nn.COMPANY_PLACEHOLDER = "Søk på selskap eller org. nr";
en.COMPANY_PLACEHOLDER = "Search for company or organisational number";

nb.ABORT_YES = "Ja";
nn.ABORT_YES = "Ja";
en.ABORT_YES = "Yes";

nb.ABORT_NO = "Nei";
nn.ABORT_NO = "Nei";
en.ABORT_NO = "No";

nb.ABORT_INFO = "Avbryt bestilling - er du sikker?";
nn.ABORT_INFO = "Avbryt bestilling - er du sikker?";
en.ABORT_INFO = "Cancel order - are you sure?";

nb.NEXT_PAGE = "Neste";
nn.NEXT_PAGE = "Neste";
en.NEXT_PAGE = "Next";

nb.ORDER = "Bestill";
nn.ORDER = "Bestill";
en.ORDER = "Order";

nb.AGREEMENT_LINK = "Avtaledokument";
nn.AGREEMENT_LINK = "Avtaledokument";
en.AGREEMENT_LINK = "Agreement";

nb.PAGE_HELP_HEADLINE = "Står du fast?";
nn.PAGE_HELP_HEADLINE = "Står du fast?";
en.PAGE_HELP_HEADLINE = "Need help?";

nb.PAGE_HELP_MESSAGE = "Husk at du kan ringe vårt kundesenter på telefon {{phone}}. Vi har åpent {{hours}}.";
nn.PAGE_HELP_MESSAGE = "Hugs at du kan ringje vårt kundesenter på telefon {{phone}}. Vi har opent {{hours}}.";
en.PAGE_HELP_MESSAGE = "Remember that you can call our customer service {{phone}}. We are open {{hours}}.";

nb.PAGE_HELP_MESSAGE_GENERAL = "Ta kontakt med kundesenteret.";
nn.PAGE_HELP_MESSAGE_GENERAL = "Ta kontakt med kundesenteret.";
en.PAGE_HELP_MESSAGE_GENERAL = "Please contact customer service.";

nb.SELECT_PLACEHOLDER = "Velg";
nn.SELECT_PLACEHOLDER = "Vel";
en.SELECT_PLACEHOLDER = "Select";

nb.ACCOUNT_PLACEHOLDER = "Tast inn kontonr eller navn";
nn.ACCOUNT_PLACEHOLDER = "Tast inn kontonr eller namn";
en.ACCOUNT_PLACEHOLDER = "Enter the account number or name";

nb.FILL_IN_FORM = "Legg inn opplysninger";
nn.FILL_IN_FORM = "Legg inn opplysningar";
en.FILL_IN_FORM = "Enter information";

nb.OPTIONAL = "valgfritt";
nn.OPTIONAL = "valfritt";
en.OPTIONAL = "optional";

// Receipt page
nb.RECEIPT_MESSAGE_SENT = "Melding om signering er sendt til følgende personer:";
nn.RECEIPT_MESSAGE_SENT = "Melding om signering er sendt til følgande personar:";
en.RECEIPT_MESSAGE_SENT = "Notification regarding signing has been sent to the following persons:";

nb.RECEIPT_SIGN_HEADER = "Takk for din bestilling.";
nn.RECEIPT_SIGN_HEADER = "Takk for di bestilling.";
en.RECEIPT_SIGN_HEADER = "Thank you for your order.";

nb.YOUR_CONTACT_INFO = "Din kontaktinformasjon";
nn.YOUR_CONTACT_INFO = "Din kontaktinformasjon";
en.YOUR_CONTACT_INFO = "Your contact information";

nb.RECEIPT_CONTACT_US_TEXT = "Har du spørsmål vedrørende din bestilling? Husk at du kan ringe kundesenteret " +
    "på telefon {{phoneNumber}}. Vi har åpent {{openingHours}}.";
nn.RECEIPT_CONTACT_US_TEXT = "Har du spørsmål med omsyn til di bestilling? Hugs at du kan ringje kundesenteret " +
    "på telefon {{phoneNumber}}. Vi har opent {{openingHours}}.";
en.RECEIPT_CONTACT_US_TEXT = "Any questions regarding your order? Please contact our customer service " +
    "{{phoneNumber}}. We are open {{openingHours}}.";


nb.RECEIPT_CONTACT_US_TEXT_GENERAL = "Har du spørsmål vedrørende din bestilling? Ta kontakt med kundesenteret.";
nn.RECEIPT_CONTACT_US_TEXT_GENERAL = "Har du spørsmål med omsyn til di bestilling? Ta kontakt med kundesenteret.";
en.RECEIPT_CONTACT_US_TEXT_GENERAL = "Any questions regarding your order? Please contact our customer service.";

nb.ORDER_ADDITIONAL = "Bestill flere produkter og tjenester";
nn.ORDER_ADDITIONAL = "Bestill fleire produkt og tenester";
en.ORDER_ADDITIONAL = "Order additional products and services";

nb.NOMINAL_VALUE = "Pålydende beløp";
nn.NOMINAL_VALUE = "Pålydande beløp";
en.NOMINAL_VALUE = "Nominal value";

nb.NOMINAL_CURRENCY = "Pålydende valuta";
nn.NOMINAL_CURRENCY = "Pålydande valuta";
en.NOMINAL_CURRENCY = "Nominal currency";

nb.DATE_VALID_TO = "Gyldig til";
nn.DATE_VALID_TO = "Gyldig til";
en.DATE_VALID_TO = "Valid until";

nb.ADD_PERSON = "Legg til flere";
nn.ADD_PERSON = "Legg til fleire";
en.ADD_PERSON = "Add more";

nb.SSN = "Fødselsnummer";
nn.SSN = "Fødselsnummer";
en.SSN = "Personal ID number";

nb.NAME = "Navn";
nn.NAME = "Namn";
en.NAME = "Name";

nb.FIRST_NAME = "Fornavn";
nn.FIRST_NAME = "Fornamn";
en.FIRST_NAME = "First name";

nb.LAST_NAME = "Etternavn";
nn.LAST_NAME = "Etternamn";
en.LAST_NAME = "Last name";

nb.EMAIL = "E-postadresse";
nn.EMAIL = "E-postadresse";
en.EMAIL = "Email address";

nb.MOBILE = "Mobilnummer";
nn.MOBILE = "Mobilnummer";
en.MOBILE = "Mobile number";

nb.CHANGE = "Endre";
nn.CHANGE = "Endre";
en.CHANGE = "Change";

nb.REMOVE = "Fjern";
nn.REMOVE = "Fjern";
en.REMOVE = "Remove";

nb.ORGANIZATION_NUMBER = "Org. nr:";
nn.ORGANIZATION_NUMBER = "Org. nr:";
en.ORGANIZATION_NUMBER = "Org. no:";

nb.RECEIPT = "Kvittering";
nn.RECEIPT = "Kvittering";
en.RECEIPT = "Receipt";

nb.SIGNING = "Signering";
nn.SIGNING = "Signering";
en.SIGNING = "Signing";

nb.SIGN_AGREEMENT = "Signere avtale";
nn.SIGN_AGREEMENT = "Signere avtale";
en.SIGN_AGREEMENT = "Sign agreement";

nb.NEW_USER = "Ny bruker";
nn.NEW_USER = "Ny brukar";
en.NEW_USER = "New user";

nb.SIGNING_NOT_POSSIBLE = "Det er ikke mulig å signere denne avtalen elektronisk.";
nn.SIGNING_NOT_POSSIBLE = "Det er ikkje mogleg å signere denne avtalen elektronisk.";
en.SIGNING_NOT_POSSIBLE = "It is not possible to digitally sign this agreement.";

nb.SIGNING_NOT_POSSIBLE_2 = "Send bestillingen til banken, og vi behandler den manuelt.";
nn.SIGNING_NOT_POSSIBLE_2 = "Send bestillinga til banken, og vi behandlar den manuelt.";
en.SIGNING_NOT_POSSIBLE_2 = "Please submit the order to the bank for manual processing.";

nb.SIGNING_COMMENT = "Eventuell kommentar (valgfritt)";
nn.SIGNING_COMMENT = "Eventuell kommentar (valfritt)";
en.SIGNING_COMMENT = "Optional comment";

nb.SEND_TO_BANK = "Send til banken";
nn.SEND_TO_BANK = "Send til banken";
en.SEND_TO_BANK = "Send to the bank";

nb.SEND_TO_SIGNING = "Send til signering";
nn.SEND_TO_SIGNING = "Send til signering";
en.SEND_TO_SIGNING = "Send for signing";

nb.NO_SIGN_HELPTEXT = "Du mottar e-post når avtalen er ferdig signert, og ved eventuelle problemer underveis";
nn.NO_SIGN_HELPTEXT = "Du mottar e-post når avtalen er ferdig signert, og ved eventuelle problem undervegs";
en.NO_SIGN_HELPTEXT = "You will receive an email once the agreement has been signed, and if any problems arise";

nb.MULTIPLE_RULES_AVAILABLE = "Det finnes flere muligheter. Velg hvem som skal signere.";
nn.MULTIPLE_RULES_AVAILABLE = "Det finnast fleire moglegheiter. Vel kven som skal signere.";
en.MULTIPLE_RULES_AVAILABLE = "There are several options. Select who will sign.";

en.MULTIPLE_RULES_AVAILABLE_SHORT = "Velg hvem som skal signere.";
en.MULTIPLE_RULES_AVAILABLE_SHORT = "Vel kven som skal signere.";
en.MULTIPLE_RULES_AVAILABLE_SHORT = "Select who will sign.";

nb.NEW_COMPANY_AGREEMENT = "Nytt selskap";
nn.NEW_COMPANY_AGREEMENT = "Nytt selskap";
en.NEW_COMPANY_AGREEMENT = "New company";

nb.MAIN_COMPANY_AGREEMENT = "Hovedselskap:";
nn.MAIN_COMPANY_AGREEMENT = "Hovudselskap:";
en.MAIN_COMPANY_AGREEMENT = "Main company:";

nb.SIGNATURE_RIGHTS = "Avtalen må signeres elektronisk i henhold til bedriftens signeringsregler.\nFølgende " +
    "signeringsregler er hentet fra Foretaksregisteret:";
nn.SIGNATURE_RIGHTS = "Avtalen må signeres elektronisk ut frå bedriftens signeringsreglar.\nFølgjande " +
    "signeringsreglar er henta frå Føretaksregisteret:";
en.SIGNATURE_RIGHTS = "The agreement has to be signed electronically in accordance to the organisation signing " +
    "rules.\nThe following signing rules are derived from the Commercial Register:";

nb.PROCURATION_RIGHTS = "Avtalen må signeres elektronisk i henhold til bedriftens signeringsregler.\nFølgende " +
    "signeringsregler er hentet fra Foretaksregisteret:";
nn.PROCURATION_RIGHTS = "Avtalen må signeres elektronisk ut frå bedriftens signeringsreglar.\nFølgjande " +
    "signeringsreglar er henta frå Føretaksregisteret:";
en.PROCURATION_RIGHTS = "The agreement has to be signed electronically in accordance to the organisation signing " +
    "rules.\nThe following signing rules are derived from the Commercial Register:";

nb.THERE_ARE_MANY_POSSIBILITIES = "Det finnes flere muligheter. Velg hvem som skal signere.";
nn.THERE_ARE_MANY_POSSIBILITIES = "Det finst fleire moglegheiter. Vel kven som skal signere.";
en.THERE_ARE_MANY_POSSIBILITIES = "There are several possible signing rules. Please choose who will sign.";

nb.ALL_FIELDS_MUST_BE_FILLED = "Alle felter må vÃ¦re utfylt. Det er viktig at vi har riktig kontaktinformasjon, " +
    "ellers kan ikke avtalen signeres. Du kan endre kontaktinformasjonen her. Endringene vil kun gjelde for " +
    "denne bestillingen.";
nn.ALL_FIELDS_MUST_BE_FILLED = "Alle felt må vÃ¦re utfylde. Det er viktig at vi har riktig kontaktinformasjon, " +
    "ellers kan ikkje avtalen signeres. Du kan endre kontaktinformasjonen her. Endringane vil kun gjelde for " +
    "denne bestillinga.";
en.ALL_FIELDS_MUST_BE_FILLED = "All fields must be filled in. It is important that we have the correct information, " +
    "or the agreement can not be signed. You can change the contact information here. The changes will only apply for " +
    "this order.";

nb.TEXT_SELECT_ONE_SIGNER = "Velg ett styremedlem";
nn.TEXT_SELECT_ONE_SIGNER = "Vel eit styremedlem";
en.TEXT_SELECT_ONE_SIGNER = "Select a board member";

nb.TEXT_CHOOSE_PERSON = "Velg person";
nn.TEXT_CHOOSE_PERSON = "Vel person";
en.TEXT_CHOOSE_PERSON = "Select a person";

nb.SIGNING_RULE_SELECT_HELP = "De som skal signere mottar e-post og sms med lenke til avtalen.";
nn.SIGNING_RULE_SELECT_HELP = "Dei som skal signere mottar e-post og sms med lenke til avtalen.";
en.SIGNING_RULE_SELECT_HELP = "The signers will receive an email and text with a link to the agreement.";

nb.CONTACT_PARTIAL_SIGNER = "{{name}}, på e-post {{email}} og telefon {{mobile}}.";
nn.CONTACT_PARTIAL_SIGNER = "{{name}}, på e-post {{email}} og telefon {{mobile}}.";
en.CONTACT_PARTIAL_SIGNER = "{{name}}, for the email {{email}} and phone {{mobile}}.";

nb.CONTACT_PARTIAL_USER = "Din kontaktinformasjon: {{name}}, e-post {{email}} og telefon {{mobile}}.";
nn.CONTACT_PARTIAL_USER = "Din kontaktinformasjon: {{name}}, e-post {{email}} og telefon {{mobile}}.";
en.CONTACT_PARTIAL_USER = "Your contact information: {{name}}, email {{email}} and phone {{mobile}}.";

nb.INFO_ORGANISATION_PARTIAL = "Avtalen gjelder: {{name}}, {{number}}.";
nn.INFO_ORGANISATION_PARTIAL = "Avtalen gjeld: {{name}}, {{number}}.";
en.INFO_ORGANISATION_PARTIAL = "The agreement is for: {{name}}, {{number}}.";

// Signature rules
nb.MANAGING_DIRECTOR_SOLELY = "Daglig leder alene";
nn.MANAGING_DIRECTOR_SOLELY = "Dagleg leiar åleine";
en.MANAGING_DIRECTOR_SOLELY = "The managing director alone";

nb.CHAIRMAN_SOLELY = "Styrets leder alene";
nn.CHAIRMAN_SOLELY = "Styrets leiar åleine";
en.CHAIRMAN_SOLELY = "The chairman alone";

nb.VICE_CHAIRMAN_SOLELY = "Nestleder alene";
nn.VICE_CHAIRMAN_SOLELY = "Nestleiar åleine";
en.VICE_CHAIRMAN_SOLELY = "The deputy chairman alone";

nb.BOARD_JOINTLY = "Styret i fellesskap (alle styremedlemmene)";
nn.BOARD_JOINTLY = "Styret i fellesskap (alle styremedlemmene)";
en.BOARD_JOINTLY = "The board jointly (all board members)";

nb.SINGLE_BOARD_MEMBER = "Styrets medlemmer hver for seg (Ã©n person)";
nn.SINGLE_BOARD_MEMBER = "Styrets medlemmer kvar for seg (ein person)";
en.SINGLE_BOARD_MEMBER = "The board members individually (one person)";

nb.TWO_BOARD_MEMBERS = "To styremedlemmer i fellesskap (to personer)";
nn.TWO_BOARD_MEMBERS = "To styremedlemner i fellesskap (to personar)";
en.TWO_BOARD_MEMBERS = "Two board members jointly (two persons)";

nb.CHAIRMAN_AND_BOARD_MEMBER = "Styrets leder og ett styremedlem i fellesskap (to personer)";
nn.CHAIRMAN_AND_BOARD_MEMBER = "Styrets leiar og eit styremedlem i fellesskap (to personar)";
en.CHAIRMAN_AND_BOARD_MEMBER = "The chairman and one board member jointly (two persons)";

nb.MANAGING_DIRECTOR_AND_CHAIRMAN = "Daglig leder og styrets leder i fellesskap (to personer)";
nn.MANAGING_DIRECTOR_AND_CHAIRMAN = "Daglig leiar og styrets leiar i fellesskap (to personar)";
en.MANAGING_DIRECTOR_AND_CHAIRMAN = "The managing director and the chairman jointly (two persons)";

nb.SOLE_PROPRIETORSHIP = "Enkeltpersonforetak";
nn.SOLE_PROPRIETORSHIP = "Enkeltpersonforetak";
en.SOLE_PROPRIETORSHIP = "Sole proprietorship";

nb.MANAGING_DIRECTOR_SOLELY_PROCURATION = "Daglig leder alene (prokura)";
nn.MANAGING_DIRECTOR_SOLELY_PROCURATION = "Daglig leiar åleine (prokura)";
en.MANAGING_DIRECTOR_SOLELY_PROCURATION = "The managing director solely (procuration)";

nb.CHAIRMAN_SOLELY_PROCURATION = "Styrets leder alene (prokura)";
nn.CHAIRMAN_SOLELY_PROCURATION = "Styrets leiar åleine (prokura)";
en.CHAIRMAN_SOLELY_PROCURATION = "The chairman solely (procuration)";

// Signature roles
nb.DL = "Daglig leder";
nn.DL = "Daglig leiar";
en.DL = "The managing director";

nb.SF = "Styrets leder";
nn.SF = "Styrets leiar";
en.SF = "The chairman";

nb.SM = "Styremedlem";
nn.SM = "Styremedlem";
en.SM = "The board member";

nb.NF = "Nestleder";
nn.NF = "Nestleiar";
en.NF = "The deputy chairman";

nb.SV = "Varamedlem";
nn.SV = "Varamedlem";
en.SV = "The deputy member";

nb.DLSF = "Daglig leder og styrets leder";
nn.DLSF = "Daglig leiar og styrets leiar";
en.DLSF = "The managing director and the chairman";

nb.EI = "Eier";
nn.EI = "Eigar";
en.EI = "Owner";

nb.PERSONS_WHO_MUST_SIGN = 'Personer som må signere';
nn.PERSONS_WHO_MUST_SIGN = 'Personar som må signere';
en.PERSONS_WHO_MUST_SIGN = 'Persons who must sign';

nb.PERSONS_WHO_MUST_SIGN_FOR_MAIN_COMPANY = 'Personer som må signere for hovedselskap';
nn.PERSONS_WHO_MUST_SIGN_FOR_MAIN_COMPANY = 'Personar som må signere  for hovudselskap';
en.PERSONS_WHO_MUST_SIGN_FOR_MAIN_COMPANY = 'Persons who must sign for the main company';

nb.PERSONS_WHO_MUST_SIGN_FOR_NEW_COMPANY = 'Personer som må signere for nytt selskap';
nn.PERSONS_WHO_MUST_SIGN_FOR_NEW_COMPANY = 'Personar som må signere  for nytt selskap';
en.PERSONS_WHO_MUST_SIGN_FOR_NEW_COMPANY = 'Persons who must sign for the new company';

nb.USER_IS_SIGNING = 'Du må signere med BankID';
nn.USER_IS_SIGNING = 'Du må signere med BankID';
en.USER_IS_SIGNING = 'You must sign with Bank ID';

//Validation Errors
nb.DATE_TO_FROM_ERROR = "Oppgi en gyldig dato. Eksempel: 01.01.2015";
nn.DATE_TO_FROM_ERROR = "Oppgje ein gyldig dato. Eksempel: 01.01.2015";
en.DATE_TO_FROM_ERROR = "Enter a valid date. Example: 01.01.2015";

nb.INVALID_PERIOD = "Ugyldig periode.";
nn.INVALID_PERIOD = "Ugyldig periode.";
en.INVALID_PERIOD = "Invalid timespan.";

nb.DATE_HAS_WRONG_FORMAT = "Datoen må skrives dd.mm.yyyy eller ddmmyyyy.";
nn.DATE_HAS_WRONG_FORMAT = "Datoen må skrivast dd.mm.yyyy eller ddmmyyyy.";
en.DATE_HAS_WRONG_FORMAT = "The date format must be dd.mm.yyyy or ddmmyyyy.";

nb.DATE_IS_INVALID = "Datoen er ikke en gyldig dato.";
nn.DATE_IS_INVALID = "Datoen er ikkje ein gyldig dato.";
en.DATE_IS_INVALID = "The date is not valid.";

nb.DATE_MUST_BE_IN_FUTURE = "Du må velge en dato frem i tid.";
nn.DATE_MUST_BE_IN_FUTURE = "Du må velje ein dato fram i tid.";
en.DATE_MUST_BE_IN_FUTURE = "You must select a date in the future.";

nb.TEXT_FIELD_ERROR = "Feltet må fylles ut.";
nn.TEXT_FIELD_ERROR = "Feltet må fyllast ut.";
en.TEXT_FIELD_ERROR = "The field must be filled in.";

nb.DYNAMIC_TEXT_FIELD_ERROR = " må fylles ut.";
nn.DYNAMIC_TEXT_FIELD_ERROR = " må fyllast ut.";
en.DYNAMIC_TEXT_FIELD_ERROR = " must be filled in.";

nb.TEXT_FIELD_CONTENTS_ERROR = "Du har brukt ugyldige tegn.";
nn.TEXT_FIELD_CONTENTS_ERROR = "Du har brukt ugyldige teikn.";
en.TEXT_FIELD_CONTENTS_ERROR = "You have used invalid characters.";

nb.AMOUT_AND_CURRENCY_ERROR = "Oppgi et gyldig beløp. Beløpet kan bare bestå av hele tall - uten komma eller punktum.";
nn.AMOUT_AND_CURRENCY_ERROR = "Oppgje eit gyldig beløp. Beløpet kan berre bestå av heile tall - utan komma eller punktum.";
en.AMOUT_AND_CURRENCY_ERROR = "Enter a valid amount. The amount has to contain digits - without commas or fullstops.";

nb.DROPDOWN_ERROR = "Velg et felt i nedtrekksmenyen.";
nn.DROPDOWN_ERROR = "Vel eit felt i nedtrekksmenyen.";
en.DROPDOWN_ERROR = "Select an option in the dropdown menu.";

nb.ORGANIZATION_ERROR = "Velg en organisasjon.";
nn.ORGANIZATION_ERROR = "Vel ein organisasjon.";
en.ORGANIZATION_ERROR = "Select an organisation.";

nb.RADIO_ERROR = "Du må velge ett alternativ.";
nn.RADIO_ERROR = "Du må velje eitt alternativ.";
en.RADIO_ERROR = "Select an option.";

nb.SSN_ERROR = "Oppgi et gyldig personnummer (11-siffer). Eksempel: 05096838710";
nn.SSN_ERROR = "Oppgje eit gyldig personnummer (11-siffer). Eksempel: 05096838710";
en.SSN_ERROR = "Enter a valid personal ID (11-digits). Example: 05096838710";

nb.CHECKBOX_ERROR = "Du må velge ett eller flere alternativer.";
nn.CHECKBOX_ERROR = "Du må velje eitt eller fleire alternativ.";
en.CHECKBOX_ERROR = "Select one or more options.";

nb.SINGLE_CHECKBOX_ERROR = "Avkryssingsboks må velges";
nn.SINGLE_CHECKBOX_ERROR = "Avkryssingsboks må veljast";
en.SINGLE_CHECKBOX_ERROR = "Select a checkbox";

nb.ACCOUNT_DROPDOWN_ERROR = "Velg en konto.";
nn.ACCOUNT_DROPDOWN_ERROR = "Vel ein konto.";
en.ACCOUNT_DROPDOWN_ERROR = "Select an account.";

nb.FILE_NAME_TOO_LONG = "Filnavnet kan ikke vÃ¦re lenger enn {{arg}} tegn.";
nn.FILE_NAME_TOO_LONG = "Filnamnet kan ikkje vere lenger enn {{arg}} teikn.";
en.FILE_NAME_TOO_LONG = "The filename cannot be longer than {{arg}} characters.";

nb.ILLEGAL_CHARACTERS_IN_FILE_NAME = "Filnavnet inneholder ulovlige tegn.";
nn.ILLEGAL_CHARACTERS_IN_FILE_NAME = "Filnamnet inneheld ulovlege teikn.";
en.ILLEGAL_CHARACTERS_IN_FILE_NAME = "The filename contains characters that are not allowed.";

nb.ILLEGAL_EXTENSION = "Filtypen er ikke tillatt. Last opp PDF-fil.";
nn.ILLEGAL_EXTENSION = "Filtypen er ikkje tillatt. Last opp PDF-fil.";
en.ILLEGAL_EXTENSION = "The filetype is not valid. Please upload a PDF file.";

nb.FILES_TOO_LARGE = "Total filstørrelse kan ikke vÃ¦re større enn {{arg}} MB.";
nn.FILES_TOO_LARGE = "Total filstørrelse kan ikkje overstige {{arg}} MB.";
en.FILES_TOO_LARGE = "The filesize cannot exceed {{arg}} MB.";

nb.FILE_TOO_LARGE = "Filstørrelse kan ikke vÃ¦re større enn {{arg}} MB.";
nn.FILE_TOO_LARGE = "Filstørrelse kan ikkje overstige {{arg}} MB.";
en.FILE_TOO_LARGE = "The filesize cannot exceed {{arg}} MB.";

nb.FILE_UPLOAD_ERROR = "Det oppsto en feil ved opplasting av filen.\n\nVennligst prøv igjen.";
nn.FILE_UPLOAD_ERROR = "Det oppstod ein feil ved opplasting av fila.\n\nVer venleg å prøve igjen.";
en.FILE_UPLOAD_ERROR = "An error occurred during the upload of the file.\n\nPlease try again.";

nb.AT_LEAST_ONE_FILE = "Du må laste opp minst Ã©n fil.";
nn.AT_LEAST_ONE_FILE = "Du må laste opp minst ei fil.";
en.AT_LEAST_ONE_FILE = "Please select one file to upload.";

nb.FILE_ALREADY_UPLOADED = "Filen er allerede lagt til.";
nn.FILE_ALREADY_UPLOADED = "Fila er allereie lasta opp.";
en.FILE_ALREADY_UPLOADED = "The file has already been uploaded.";

nb.AN_ERROR_OCCURED = 'Det oppsto en feil. Vennligst prøv igjen. Kontakt kundeservice hvis feilen gjentar seg.';
nn.AN_ERROR_OCCURED = 'Det oppstod ein feil. Ver venleg å prøve igjen. Kontakt kundeservice dersom feilen gjentar seg.';
en.AN_ERROR_OCCURED = 'An error occured. Please try again later. If the error reoccurs please contact our customer service.';

nb.ORGANIZATION_LOAD_ERROR = 'Det oppstod en feil under lasting av organisasjoner.';
nn.ORGANIZATION_LOAD_ERROR = 'Det oppstod ein feil under lasting av organisasjonar.';
en.ORGANIZATION_LOAD_ERROR = 'An error occured during the loading of organisations.';

nb.USER_AT_LEAST_ONE = "Minst ett felt må fylles ut.";
nn.USER_AT_LEAST_ONE = "Minst eitt felt må fyllast ut.";
en.USER_AT_LEAST_ONE = "At least one field must be specified.";

nb.MOBILE_PHONE_ERROR = "Oppgi et gyldig mobilnummer (8-siffer).";
nn.MOBILE_PHONE_ERROR = "Oppgje eit gyldig mobilnummer (8-siffer).";
en.MOBILE_PHONE_ERROR = "Enter a valid mobile number (8-digits).";

nb.POSTAL_CODE_ERROR = "Oppgi et gyldig postnummer (4-siffer).";
nn.POSTAL_CODE_ERROR = "Oppgje eit gyldig postnummer (4-siffer).";
en.POSTAL_CODE_ERROR = "Enter a valid postcode (4-digits).";

nb.ACCOUNT_FIELD_ERROR = "Oppgi et gyldig kontonummer (11-siffer).";
nn.ACCOUNT_FIELD_ERROR = "Oppgje eit gyldig kontonummer (11-siffer).";
en.ACCOUNT_FIELD_ERROR = "Enter a valid account number (11-digits).";

nb.EMAIL_FIELD_ERROR = "Oppgi en gyldig e-postadresse. Eksempel: per.olsen@mittfirma.no";
nn.EMAIL_FIELD_ERROR = "Oppgje ein gyldig e-postadresse. Eksempel: per.olsen@mittfirma.no";
en.EMAIL_FIELD_ERROR = "Enter a valid e-mail address. Example: per.olsen@mycompany.com";

nb.OTHER_ORGANISATION_FIELD_ERROR = "Oppgi et gyldig organisasjonsnummer (9-siffer).";
nn.OTHER_ORGANISATION_FIELD_ERROR = "Oppgje eit gyldig organisasjonsnummer (9-siffer).";
en.OTHER_ORGANISATION_FIELD_ERROR = "Enter a valid organisation number (9-digits).";

nb.FORM_HAS_MANY_ERRORS = 'Skjemaet inneholder flere feil. Se under for mer informasjon.';
nn.FORM_HAS_MANY_ERRORS = 'Skjemaet inneheld fleire feil. Sjå nedanfor for meir informasjon.';
en.FORM_HAS_MANY_ERRORS = 'The form contains errors. See below for more information.';

nb.SUPPLEMENTAL_AGREEMENT_ORGNO_NOT_FOUND = 'Organisasjonsnummer til tilleggsavtale ({{orgNo}}) ikke funnet.';
nn.SUPPLEMENTAL_AGREEMENT_ORGNO_NOT_FOUND = 'Organisasjonsnummer til tilleggsavtale ({{orgNo}}) ikkje funne.';
en.SUPPLEMENTAL_AGREEMENT_ORGNO_NOT_FOUND = 'Organisation number for supplementary agreement ({{orgNo}}) not found.';

nb.PERSON_INFO_SSN = 'Fødselsnummer';
nn.PERSON_INFO_SSN = 'Fødselsnummer';
en.PERSON_INFO_SSN = 'Personal ID number';

nb.PERSON_INFO_NAME = 'Navn';
nn.PERSON_INFO_NAME = 'Namn';
en.PERSON_INFO_NAME = 'Name';

nb.PERSON_INFO_EMAIL = "E-postadresse";
nn.PERSON_INFO_EMAIL = "E-postadresse";
en.PERSON_INFO_EMAIL = "Email address";

nb.PERSON_INFO_MOBILE = "Mobilnummer";
nn.PERSON_INFO_MOBILE = "Mobilnummer";
en.PERSON_INFO_MOBILE = "Mobile number";

nb.GUARANTEE_CREDITOR_ORGNO = "Organisasjonsnummer";
nn.GUARANTEE_CREDITOR_ORGNO = "Organisasjonsnummer";
en.GUARANTEE_CREDITOR_ORGNO = "Organisation number";

nb.GUARANTEE_CREDITOR_COMPANY_NAME = "Bedriftens navn";
nn.GUARANTEE_CREDITOR_COMPANY_NAME = "Namn på bedrifta";
en.GUARANTEE_CREDITOR_COMPANY_NAME = "Company name";

nb.GUARANTEE_CREDITOR_STREET_ADDRESS = "Gateadresse";
nn.GUARANTEE_CREDITOR_STREET_ADDRESS = "Gateadresse";
en.GUARANTEE_CREDITOR_STREET_ADDRESS = "Street address";

nb.GUARANTEE_CREDITOR_POSTAL_CODE = "Postnummer";
nn.GUARANTEE_CREDITOR_POSTAL_CODE = "Postnummer";
en.GUARANTEE_CREDITOR_POSTAL_CODE = "Postal code";

nb.GUARANTEE_CREDITOR_CITY = "Poststed";
nn.GUARANTEE_CREDITOR_CITY = "Poststad";
en.GUARANTEE_CREDITOR_CITY = "City/town";

nb.ADDRESS = "Adresse";
nn.ADDRESS = "Adresse";
en.ADDRESS = "Address";

nb.HOMETOWN = "Poststed";
nn.HOMETOWN = "Poststad";
en.HOMETOWN = "City/town";

var textResources;
if (user.language === "en") {
    textResources = en;
} else if(user.language === "nn") {
    textResources = nn;
} else {
    textResources = nb;
}

module.exports = textResources;
