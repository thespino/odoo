/** @odoo-module **/

import { registerPatch } from '@mail/model/model_core';

import {setCookie} from 'web.utils.cookies';

registerPatch({
    name: 'PublicLivechatGlobal',
    recordMethods: {
        /**
         * Check if a chat request is opened for this visitor
         * if yes, replace the session cookie and start the conversation
         * immediately. Do this before calling super to have everything ready
         * before executing existing start logic. This is used for chat request
         * mechanism, when an operator send a chat request from backend to a
         * website visitor.
         *
         * @override
         */
        willStart() {
            if (this.isTestChatbot) {
                /**
                 * Overridden to avoid calling the "init" endpoint as it
                 * requires a im_livechat.channel linked to work properly.
                 */
                return this.loadQWebTemplate();
            }
            if (this.options.chat_request_session) {
                setCookie('im_livechat_session', JSON.stringify(this.options.chat_request_session), 60 * 60, 'required');
            }
            return this._super();
        },
    },
    fields: {
        hasWebsiteLivechatFeature: {
            compute() {
                return true;
            },
        },
    },
});
