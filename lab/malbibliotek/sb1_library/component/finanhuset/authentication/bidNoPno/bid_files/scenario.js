//	_______________________________________________
//	scenario.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// All scenarios are configured in this script and made available through the bid.scenarios array.


//	bid.Scenario
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.Scenario = function (obj) {

    var _data = {

        // string
        id: null,

        // string
        description: null,

        // arrays of bid.OTP objects
        otp: {
            personal: null,
            employee: null
        },

        // bid.Uses objects (last success and/or failed)
        used: {
            last: null,
            fail: null
        },

        // bid.Error object (scenario error)
        error: null

    };

    $.extend(_data, obj);

    // boolean
    // Whether the scenario contains several OTPs.
    _data.hasMultiple = (function () {
        var ret = false;
        $.each(_data.otp, function (key, val) {
            if (val && val.length > 1)
                ret = true;
        });
        return ret;
    }());

    return _data;

};


//	bid.scenario.Error
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.scenario.Error = function (obj) {
    var _data = {

        // string, error message
        message: null,

        // string, bid.scenario.step object
        step: null

    };

    return $.extend(_data, obj);
};


//	bid.scenarios (array)
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// 	Instanciates the scenarios and prepares a list of scenarios.

// scenarios stack
bid.scenarios = [];

(function (obj) {


    //	SERTIFICATES
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
    var sert1 = {
        merchant: {
            name: 'Brukersted navn',
            type: 'merchant',
            general: {
                bf: 'Devlab UniCERT52 Bank',
                ua: 'BankID Devlab UniCERT52 CA 1',
                tb: 'BrukerstedsBankID',
                gf: '18. august 2008 15:29:41',
                gt: '17. august 2012 15:29:40',
                ks: 'Nei'
            },
            details: {
                ve: '3',
                sn: '07 73 c9',
                sa: 'SHA1withRSA',
                ua: 'CN=BankID Devlab UniCERT52 CA 1,OU=1234567890,O=UniCERT52 Bank AS,C=NO',
                ut: 'CN=Bamble og Langesund Sparebank,OU=SecondOU,SERIALNUMBER=123456789,O=orgdlma80818012228,C=NO',
                br: '9960',
                on: '30 81 9f 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 81 8d 00 30 81 89 02 81 81 00 e0 d0 ec 74 c7 a1 fc 43 1b 65 71 37 2b 7c cd 93 26 9d 17 ce 2c f0 3f f8 47 3a ca fe be 35 72 5a 20 91 b8 50 9d 55 19 c7 f6 f4 fd 5f e3 a4 bf 3e 49 0a be a3 37 f0 d6 04 03 0e 5c d2 2e 60 f5 d1 10 99 fc 27 0d bf 23 df 8e 97 6b 8f e0 e6 6e 25 21 3c 0c 20 01 4b 7e 90 a3 ce b1 0c 0e 05 88 42 7a 78 5c 85 0b 61 91 cd 8d 1c 58 70 ea ad 2c 89 82 42 97 d0 9a 57 a3 84 da 50 ef 84 c0 86 80 73 02 03 01 00 01',
                nb: '07 c1 21 89 4d 69 68 08 51 96 0c 63 79 bc 00 e4 1d 5c 21 61',
                nu: '77 7f c5 9d ae 59 dd 57 56 71 d8 59 c3 8d 95 93 f3 a0 09 d1',
                bn: 'Ikke-benekting',
                gk: 'Tilgang til sertifikatinformasjon fra:	URI = https://bid-dev5.bbsas.no	Tilgangsmetode = Statusprotokoll for elektronisk sertifikat (OCSP)',
                sk: 'Sertifikatpolicy: Policyidentifikator = 2.16.578.1.16.1.6.1.1',
                aa: 'sha1',
                at: '57 81 95 06 83 5a f7 1c 71 29 ab 9d 88 1f eb a5 d6 c0 07 e5'
            }
        },
        personal: {
            name: 'Fornavn Etternavn',
            type: 'personal',
            general: {
                ut: 'cndln91008082210',
                bf: 'Devlab UniCERT52 Bank',
                ua: 'BankID Devlab UniCERT52 CA 1',
                tb: 'PersonBankID',
                gf: '08. oktober 2009 10:22:19',
                gt: '08. oktober 2011 10:22:17',
                ks: 'Ja',
                bg: '100000 NOK'
            },
            details: {
                ve: '3',
                sn: '07 8a 2b',
                sa: 'SHA1withRSA',
                ua: 'CN=BankID Devlab UniCERT52 CA 1,OU=1234567890,O=UniCERT52 Bank AS,C=NO',
                ut: 'CN=Bamble og Langesund Sparebank,OU=SecondOU,SERIALNUMBER=123456789,O=orgdlma80818012228,C=NO',
                fd: '24. desember 1970',
                br: '9960',
                on: '30 81 9f 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 81 8d 00 30 81 89 02 81 81 00 e0 d0 ec 74 c7 a1 fc 43 1b 65 71 37 2b 7c cd 93 26 9d 17 ce 2c f0 3f f8 47 3a ca fe be 35 72 5a 20 91 b8 50 9d 55 19 c7 f6 f4 fd 5f e3 a4 bf 3e 49 0a be a3 37 f0 d6 04 03 0e 5c d2 2e 60 f5 d1 10 99 fc 27 0d bf 23 df 8e 97 6b 8f e0 e6 6e 25 21 3c 0c 20 01 4b 7e 90 a3 ce b1 0c 0e 05 88 42 7a 78 5c 85 0b 61 91 cd 8d 1c 58 70 ea ad 2c 89 82 42 97 d0 9a 57 a3 84 da 50 ef 84 c0 86 80 73 02 03 01 00 01',
                nb: '07 c1 21 89 4d 69 68 08 51 96 0c 63 79 bc 00 e4 1d 5c 21 61',
                nu: '77 7f c5 9d ae 59 dd 57 56 71 d8 59 c3 8d 95 93 f3 a0 09 d1',
                bn: 'Digital signatur, Avtale om bruk av nøkler',
                gk: 'Tilgang til sertifikatinformasjon fra:	URI = https://bid-dev5.bbsas.no	Tilgangsmetode = Statusprotokoll for elektronisk sertifikat (OCSP)',
                sk: 'Sertifikatpolicy: Policyidentifikator = 2.16.578.1.16.1.6.1.1',
                aa: 'sha1',
                at: '57 81 95 06 83 5a f7 1c 71 29 ab 9d 88 1f eb a5 d6 c0 07 e5'
            }
        }
    };


    //	USED
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

    var use1 = {
        last: {
            heading: 'BankID sist brukt:',
            date: '17.05.10 09:37',
            merchant: 'merchant common name'
        }
    };

    var use2 = {
        fail: {
            heading: 'BankID sist forsøkt brukt:',
            date: '17.05.10 09:37',
            merchant: 'merchant common name',
            error: 'Avvist p.g.a. feil passord.'
        },
        last: {
            heading: 'BankID sist brukt:',
            date: '17.05.10 09:37',
            merchant: 'merchant common name'
        }
    };


    //	PASSWORDS
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

    var pwd1 = new bid.Password({
        len: 6,
        label: '6 siffer',
        value: '123456',
        type: 'number',
        validator: {
            fn: function (val) {
                if (bid.password.fn.isEmpty(val)) {
                    return 'Vennligst skriv inn engangskode (6 siffer)';
                }

                if (!bid.password.fn.isNumber(val) || !bid.password.fn.isLength(val, 6)) {
                    return 'Engangskode må bestå av 6 siffer';
                }

                return true;
            }
        }
    });

    var pwd2 = new bid.Password({
        len: 8,
        label: '8 tegn',
        value: 'abcd1234',
        type: 'text',
        validator: {
            fn: function (val) {
                if (bid.password.fn.isEmpty(val)) {
                    return 'Vennligst skriv inn engangskode (6 tegn)';
                }

                if (!bid.password.fn.isLength(val, 8)) {
                    return 'Engangskode må bestå av 8 tegn';
                }

                return true;
            }
        }
    });

    //	OTPs
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

    var otp1 = new bid.OTP({
        name: 'DNB kodekalkulator',
        device: bid.otp.device.CALCULATOR,
        password: pwd1
    });

    var otp2 = new bid.OTP({
        name: 'Skandiabanken kodekort',
        device: bid.otp.device.CARD,
        password: pwd2
    });

    var otp3 = new bid.OTP({
        name: 'Sparebanken Vest kodekalkulator',
        device: bid.otp.device.CALCULATOR,
        password: pwd1
    });


    //	Errors
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

    var errOTP = new bid.scenario.Error({
        step: bid.page.step.OTP,
        message: 'Feil engangskode.'
    });

    var errPWD = new bid.scenario.Error({
        step: bid.page.step.PWD,
        message: 'Feil passord.'
    });


    //	SCENARIOS
    //	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
    // Push all scenarios into the obj-parameter.

    obj.push(

        // Scenario #1
        // ‾‾‾‾‾‾‾‾‾‾‾

        new bid.Scenario({
            id: 'UC1',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Enkel innlogging i nettbank.',
            steps: [
                //bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD
            ],
            // used: use1,
            sert: sert1,
            messages: {
                button: 'Logg inn med BankID',
                ready: 'Logg deg inn i nettbanken',
                success: 'Du er nå logget inn i nettbanken',
                cancel: 'Innlogging ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC1a',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1, otp2, otp3]
            },
            description: 'Innlogging i nettbank med flere OTP-devicer. Eksempel på sist brukt og sist forsøkt brukt.',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD
            ],
            used: use2,
            sert: sert1,
            messages: {
                button: 'Logg inn med BankID',
                ready: 'Logg deg inn i nettbanken',
                success: 'Du er nå logget inn i nettbanken',
                cancel: 'Innlogging ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC1b',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Innlogging i nettbank hvor OTP er feil.',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP
            ],
            used: use1,
            sert: sert1,
            error: errOTP,
            messages: {
                button: 'Logg inn med BankID',
                ready: 'Logg deg inn i nettbanken',
                success: 'Du er nå logget inn i nettbanken',
                cancel: 'Innlogging ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC1c',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Innlogging i nettbank hvor passord er feil.',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD
            ],
            used: use1,
            sert: sert1,
            error: errPWD,
            messages: {
                button: 'Logg inn med BankID',
                ready: 'Logg deg inn i nettbanken',
                success: 'Du er nå logget inn i nettbanken',
                cancel: 'Innlogging ble avbrutt'
            }
        }),


        // Scenario #2
        // ‾‾‾‾‾‾‾‾‾‾‾
        new bid.Scenario({
            id: 'UC2',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Betalingsbekreftelse/3-D Secure.',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Betal med BankID',
                ready: 'Bekreft betaling med BankID og 3-D Secure',
                success: 'Betaling er utført',
                cancel: 'Betaling ble avbrutt'
            }
        }),

        // Scenario #3
        // ‾‾‾‾‾‾‾‾‾‾‾
        new bid.Scenario({
            id: 'UC3',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Tvungent passordbytte.',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.CHG_INFO,
                bid.page.step.CHG_PWD,
                bid.page.step.CHG_CONFIRMATION
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Endre passord',
                ready: 'Du må endre ditt BankID-passord',
                success: 'Du har endret ditt passord',
                cancel: 'Endring av passord ble avbrutt'
            }
        }),


        // Scenario #4
        // ‾‾‾‾‾‾‾‾‾‾‾
        // Betalingsbekreftelse/3ds - Brukeren har en BankID og en OTP-mekanisme
        new bid.Scenario({
            id: 'UC4',
            type: bid.page.title.IDENTIFICATION,
            otp: {
                personal: [otp1]
            },
            description: 'Innlogging i nettbank med iframe i iframe',
            steps: [
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Logg inn med BankID',
                ready: 'Logg deg inn i nettbanken',
                success: 'Du er nå logget inn i nettbanken',
                cancel: 'Innlogging ble avbrutt'
            },
            dblIframe: true
        }),

        // Scenario #5
        // ‾‾‾‾‾‾‾‾‾‾‾
        new bid.Scenario({
            id: 'UC5a',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av TXT-dokument - vist innenfor klientrammen',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_DOCUMENT_TXT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            documentSource: [
                'frame/frame_content_loader.html?url=../media/lorem_ipsum.txt'
            ],
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et TXT-dokument med BankID',
                success: 'Du har signert teksten',
                cancel: 'Signering ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC5b',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av TXT-dokumenter - vist i separat vindu/fane',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_WAIT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            wait: bid.page.step.SGN_DOCUMENT_TXT,
            documentSource: [
                'frame/frame_content_loader.html?url=../media/lorem_ipsum.txt'
            ],
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et TXT-dokument med BankID',
                success: 'Du har signert teksten',
                cancel: 'Signering ble avbrutt'
            }
        }),

        // Scenario #6
        // ‾‾‾‾‾‾‾‾‾‾‾
        new bid.Scenario({
            id: 'UC6a',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av XML-dokumenter i BIDXML-format - vist innenfor klientrammen',
            documentSource: [
                'frame/frame_content_loader.html?url=../media/lorem_ipsum.html'
            ],
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_DOCUMENT_HTML,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et XML-dokument (HTML) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC6b',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av XML-dokumenter i BIDXML-format - vist i separat vindu/fane',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_WAIT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            wait: bid.page.step.SGN_DOCUMENT_HTML,
            documentSource: [
                'frame/frame_content_loader.html?url=../media/lorem_ipsum.html'
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et XML-dokument (HTML) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        }),

        // Scenario #7
        // ‾‾‾‾‾‾‾‾‾‾‾
        new bid.Scenario({
            id: 'UC7a',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av PDF/A-dokumenter pre-konvertert til SVG i visningsformat - vist innenfor klientrammen.',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_DOCUMENT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            documentSource: [
//                 'frame/frame_content_loader.html?url=../media/img/doc/ng_ex2_ill_svg_coherent.svg',
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_1.svg', // page 1
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_2.svg', // page 2
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_3.svg', // page 3
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_4.svg', // page 4
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_5.svg' // page 5
            ],
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et PDF-dokument (SVG) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC7b',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Elektronisk signering av PDF/A-dokumenter pre-konvertert til SVG i visningsformat - vist i separat vindu/fane',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_WAIT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            wait: bid.page.step.SGN_DOCUMENT,
            documentSource: [
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_1.svg', // page 1
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_2.svg', // page 2
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_3.svg', // page 3
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_4.svg', // page 4
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_5.svg'  // page 5
            ],
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et PDF-dokument (SVG) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        }),

        new bid.Scenario({
            id: 'UC7c',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Som UC7a, men med en enklere SVG',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_DOCUMENT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            documentSource: [
                'frame/frame_content_loader.html?url=../media/img/doc/ng_ex2_ill_svg_coherent.svg'
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et PDF-dokument (SVG) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        }), 

        new bid.Scenario({
            id: 'UC7d',
            type: bid.page.title.SIGNING,
            otp: {
                personal: [otp1]
            },
            description: 'Som UC7a, men med PNG',
            steps: [
                bid.page.step.SGN_INTRO,
                bid.page.step.SGN_DOCUMENT,
                bid.page.step.SGN_CONFIRM,
                bid.page.step.PID,
                bid.page.step.OTP,
                bid.page.step.PWD,
                bid.page.step.SGN_RECEIPT
            ],
            documentSource: [
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_1.png',
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_2.png',
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_3.png',
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_4.png',
                'frame/frame_content_loader.html?url=../media/img/doc/Sparegrisen_5.png'
            ],
            used: use1,
            sert: sert1,
            messages: {
                button: 'Signer med BankID',
                ready: 'Signer et PDF-dokument (PNG) med BankID',
                success: 'Du har signert dokumentet',
                cancel: 'Signering ble avbrutt'
            }
        })
    )
    ;

}(bid.scenarios));
