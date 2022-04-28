import {Plugster} from 'https://cdn.jsdelivr.net/gh/paranoid-software/plugster@1.0.12/dist/plugster.min.js';
import {firebaseConfig} from "./config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

class SignInPlugster extends Plugster {

    constructor(outlets) {

        super(outlets);
        const firebaseApp = initializeApp(firebaseConfig);
        this.auth = getAuth(firebaseApp);
        this.setLocales({
            es: {
                'Wrong credentials.': 'Credenciales incorrectas.'
            }
        });
    }

    afterInit() {

        let self = this;

        self._.emailInput.on('blur keyup', {}, (e) => {
            if (e.target.value && self._.passwordInput.val()) {
                self._.signInButton.removeAttr('disabled');
                return
            }
            self._.signInButton.attr('disabled', '');
        });

        self._.passwordInput.on('blur keyup', {}, (e) => {
            if (e.target.value && self._.emailInput.val()) {
                self._.signInButton.removeAttr('disabled');
                return
            }
            self._.signInButton.attr('disabled', '');
        });

        self._.signInButton.click(() => {
            self.handleSignIn();
        });

    }

    handleSignIn() {

        let self = this;

        let email = self._.emailInput.val();
        let pwd = self._.passwordInput.val();

        if (!email || !pwd) {
            return;
        }

        self._.signInButton.addClass('is-loading');
        signInWithEmailAndPassword(self.auth, self._.emailInput.val(), self._.passwordInput.val()).then((credential) => {
            $.ajax({
                url: '/auth/identity/',
                type: 'POST',
                data: JSON.stringify(credential),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                headers: {
                    'X-Gateway-Token': self._.gatewayTokenHiddenInput.val()
                }
            }).done(() => {
                let queryStringMap = {};
                window.location.search.substr(1).split('&').forEach(function (q) {
                    let parts = q.split('=');
                    if (parts.length !== 2) return;
                    queryStringMap[parts[0].toString()] = parts[1].toString();
                });
                let queryString = '';
                if ('draft' in queryStringMap) {
                    queryString = 'draft=1';
                }
                window.location.replace(`/${self._.langCodeHiddentInput.val()}?${queryString}`);
            });
        }).catch(() => {
            self._.signInButton.removeClass('is-loading');
            window.bulmaToast.toast({
                message: self.translateTo(self._.langCodeHiddentInput.val(), 'Wrong credentials.'),
                position: "top-center",
                type: 'is-danger',
                dismissible: true,
                duration: 4000,
                animate: {in: 'fadeIn', out: 'fadeOut'},
            });
        });
    }

}

let signInPlugster = await new SignInPlugster({
    langCodeHiddentInput: {},
    gatewayTokenHiddenInput: {},
    emailInput: {},
    passwordInput: {},
    signInButton: {}
}).init();

Plugster.plug(signInPlugster);
