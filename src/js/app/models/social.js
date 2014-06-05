define([
    'backbone',
    'app'
], function (
    Backbone,
    App
) {
    var SocialModel = Backbone.Model.extend({

        defaults: {
            facebook_id:        '180444840287',
            hashtags:           'dreamteam',
            twitter_account:    'guardian',
            base_link:          App.publicURL,
            share_team_title:   'I chose my all-time World Cup dream team at the Guardian. Can you beat it?',
            share_result_title: 'Dream team latest result: {p1} {score1} - {score2} {p2}. Can you do better?',
            share_team_desc:    'INTERACTIVE DESCRIPTION',
            share_result_desc:  'RESULT DESCRIPTION',
            photo:              'http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/6/5/1401964714817/WorldCupDreamteam.png',
            emailSubject:       'Here is my World Cup dream team',
            emailBody:          'I chose an all-time XI on the Guardian site. Check it out and see if your selection can beat it.  {link}\n',
            redirect_url:       'http://www.theguardian.com/football/ng-interactive/2014/jun/03/-sp-world-cup-dream-team-pick-your-all-time-xi'
        },

        urls: {
            facebook: 'https://www.facebook.com/dialog/feed?app_id={app_id}&link={url}&picture={img}&name={title}&description={desc}&redirect_uri={redirect_url}',
            twitter: 'https://twitter.com/share?url={url}&text={title}&via={via}&hashtags={hashtags}',
            email: 'mailto:?subject={subject}&body={body}'
        },

        getShareResultURLs: function(options) {
            var text = this.get('share_result_title');
            text = text.replace('{p1}', options.user_1);
            text = text.replace('{p2}', options.user_2);
            text = text.replace('{score1}', options.user_1_score);
            text = text.replace('{score2}', options.user_2_score);
            options.title = text;
            options.desc = this.get('share_result_desc');
            options.body = text + ' ' + options.url;

            return {
                facebook: this.getFacebookURL(options),
                twitter: this.getTwitterURL(options),
                email: this.getEmailURL(options)
            };
        },

        getShareTeamURLs: function(options) {
            options.title = this.get('share_team_title');
            options.desc = this.get('share_team_desc');
            options.body =  this.get('emailBody').replace('{link}', options.url);

            return {
                facebook: this.getFacebookURL(options),
                twitter: this.getTwitterURL(options),
                email: this.getEmailURL(options)
            };
        },

        getEmailURL: function(options) {
            var data = {
                subject: this.get('emailSubject') || '',
                body: options.body
                // body: this.get('emailBody').replace('{link}', options.url)
            };
            return this.buildURL('email', data);
        },

        getFacebookURL: function(options) {
            var data = {
                app_id:         this.get('facebook_id')   || '',
                url:            options.url               || '',
                img:            this.get('photo')         || '',
                title:          this.get('title')         || '',
                desc:           this.get('description')   || '',
                redirect_url:   this.get('redirect_url')  || ''
            };

            return this.buildURL('facebook', data);
        },

        getTwitterURL: function(options) {
            var data = {
                url: options.url || '',
                via: this.get('twitter_account') || '',
                hashtags: this.get('hashtags') || '',
                title: options.title 
            };

            return this.buildURL('twitter', data);
        },

        buildURL: function(serviceName, params) {
            var url = this.urls[serviceName];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    url = url.replace('{' + key + '}', encodeURIComponent(params[key]));
                }
            }
            return url;
        }
    });

    return new SocialModel();
});
