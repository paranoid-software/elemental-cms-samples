import {Plugster} from 'https://cdn.jsdelivr.net/gh/paranoid-software/plugster@1.0.12/dist/plugster.min.js';
import {firebaseConfig} from "./config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

class SignOutPlugster extends Plugster {

    constructor(outlets) {

        super(outlets);
        const firebaseApp = initializeApp(firebaseConfig);
        this.auth = getAuth(firebaseApp);

    }

    afterInit() {

        let self = this;

        if (self._.root.data('visible') === 'False') {
            self._.root.remove();
            return;
        }

        self._.signOutButton.click(() => {
           self.handleSignOut();
        });

    }

    handleSignOut() {
        let self = this;
        signOut(self.auth).then(() => {
            $.ajax( {
                url: '/auth/identity/',
                type: 'DELETE',
                headers: {
                    'X-Gateway-Token': self._.gatewayTokenHiddenInput.val()
                }
            }).done((response) => {
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
        });
    }

}

let signOutPlugster = await new SignOutPlugster({
    langCodeHiddentInput: {},
    gatewayTokenHiddenInput: {},
    signOutButton: {}
}).init();

Plugster.plug(signOutPlugster);
