<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-spacer></v-spacer>
        <v-flex class="about-content" md8>
          <h1 class="headline mb-3">Egghead Space</h1>
          <p>
            A place to share project ideas.
          </p>
          <v-expansion-panel expand>
            <v-expansion-panel-content>
              <div slot="header"><h2 class="headline">About</h2></div>
              <v-card>
                <v-card-text class="grey lighten-3">
                  <p>
                    egghead.space was born out of the genuine need for a web app to note project ideas
                    &ndash; which we have a lot of.
                  </p>
                  <p>
                    It is probably not the best place to look for the next startup idea to make your
                    rich though. Web doubt things like &laquo;RAM disc as a service&raquo; will have
                    any positive impact on your checking account. However, discussing and (maybe)
                    realising such projects can be a lot of fun.
                  </p>
                  <p>
                    And that's what this page is all about: <router-link to="create">sharing</router-link>,
                    discussing and maybe realising your most awesome project ideas.
                  </p>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <div slot="header"><h2 class="headline">Privacy Policy</h2></div>
              <v-card>
                <v-card-text class="grey lighten-3">
                   <h4>Honestly</h4>
                   <p>
                     We don't speak legalese, so if you think we do anything wrong, please
                     <a href="mailto:legal@egghead.space">send an email</a> instead of sueing us. On
                     the other hand, what we do is simple and we think our sueing surface is small
                     enough.
                   </p>
                   <div style="display: inline-block">
                    <img src="field_of_cookies.jpeg" style="float: right; margin: 15px;">
                    <h4>We dont't collect any data&hellip;</h4>
                    <p>
                      We will not collect any data about you &ndash; there's no google-, facebook-
                      or $ad_company-cookie on this site. Actually, there are zero cookies.
                    </p>
                    <h4>&hellip;until we have to</h4>
                    <h5>How you can create an account</h5>
                    <p class="simple">
                      To post content on hour site, we require you to create an account.
                      Unfortunately, this seems to be the simplest way to keep bots and low quality
                      content away. You can use either of the following providers to create an
                      account:
                      <ul>
                        <li>Google</li>
                        <li>Twitter</li>
                        <li>Github</li>
                        <li>Sign up form</li>
                      </ul>
                    </p>
                    <h5>What data we collect</h5>
                    <p class="simple">
                      Disregarding your choice of sign in method, we will collect the following data
                      about you:
                      <ul>
                        <li>
                          <em>Display name (or &bdquo;user name&ldquo;):</em> This will be the
                          public name of your account and we display it on your profile page, next
                          to your comments etc. You can change it (almost) any way you like. From
                          &bdquo;[anon]&ldquo; to &bdquo;x&ldquo;. Also, your user name doesn't have
                          to be unique.<br>
                          Please note though, that we do not allow empty user names.
                        </li>
                        <li>
                          <em>Email address:</em>Yes, we will store your email address. However, we
                          will only use it on very few occasions:
                          <ol>
                            <li>
                              To verify the ownership of the account in case you request us to
                              remove all data about you.
                            </li>
                            <li>
                              To verify the ownership of the account in case you want to download
                              all data we have stored about you.
                            </li>
                          </ol>
                          You can change your email on your profile page.
                        </li>
                        <li>
                          <em>Profile picture (or &bdquo;avatar&ldquo;):</em> We will display your
                          avatar on your public profile page and in other places we see fit. You can
                          change your avatar any way you want.
                        </li>
                      </ul>
                      Additionally, we use google firebase services to run this site. Data collected
                      by these services can and will not accessed by us. These services will collect
                      the following data:
                      <table class="services">
                        <tr>
                          <th>Service</th>
                          <th>Data</th>
                          <th>How data helps provide the service</th>
                        </tr>
                        <tr>
                          <td>Cloud Functions for Firebase</td>
                          <td>IP addresses</td>
                          <td>
                            <em>How it helps:</em> Cloud Functions uses IP addresses to execute event-handling functions and HTTP functions based on end-user actions.<br>
                            <em>Retention:</em> Cloud functions only saves IP addresses temporarily, to provide the service.
                          </td>
                        </tr>
                        <tr>
                          <td>Firebase Authentication</td>
                          <td>
                            Passwords<br>
                            Email addresses<br>
                            Phone numbers<br>
                            User agents<br>
                            IP addresses<br>
                          </td>
                          <td>
                            <em>How it helps:</em> Firebase Authentication uses the data to enable end-user authentication, and facilitate end-user account management. It also uses user-agent strings and IP addresses to provide added security and prevent abuse during sign-up and authentication.<br>
                            <em>Retention:</em> Firebase Authentication keeps logged IP addresses for a few weeks. It retains other authentication information until the Firebase customer initiates deletion of the associated user, after which data is removed from live and backup systems within 180 days.
                          </td>
                        </tr>
                        <tr>
                          <td>Firebase Hosting</td>
                          <td>IP addresses</td>
                          <td>
                            <em>How it helps:</em> <div>Hosting uses IP addresses of incoming requests to detect abuse and provide customers with detailed analysis of usage data.</div><br>
                            <em>Retention:</em> Hosting retains IP data for a few months.
                          </td>
                        </tr>
                      </table>
                    </p>
                    <h5>Where we store the data</h5>
                    <p class="simple">
                      The data is potentially stored in any of the <a href="https://cloud.google.com/about/locations/" target="_blank">Google Cloud Platform locations</a>.
                    </p>
                    <h5>3rd-party access</h5>
                    <p class="simple">
                      We will not let any 3rd party access your data.
                    </p>
                    <h5>How you can request your personal data</h5>
                    <p>Send us an <a href="mailto:legal@egghead.space">email</a>.</p>
                    <h5>How you can remove your personal data</h5>
                    <p>Send us an <a href="mailto:legal@egghead.space">email</a>.</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <div slot="header"><h2 class="headline">Imprint</h2></div>
              <v-card>
                <v-card-text class="grey lighten-3">
                  Imprint
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <div slot="header"><h2 class="headline">Licenses</h2></div>
              <p>
                We <v-icon color="accent">fa fa-heart</v-icon> open source.
              </p>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <div slot="header"><h2 class="headline">Version</h2></div>
              <p>
                We are running PHP, Java, Perl, MySQL and Postgres<br>
                Built @ {{buildDate}} from branch {{gitBranch}} @ <a :href="commitUrl">{{gitHash}}</a>
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      /* eslint-disable no-undef */
      gitHash: __COMMIT_HASH__,
      commitUrl:
        "https://github.com/sne11ius/egghead.space/commits/" + __COMMIT_HASH__,
      gitBranch: __BRANCH_NAME__,
      buildDate: __BUILD_DATE__
    };
  }
};
</script>

<style lang="scss" scoped>
.about-content {
  h4 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  h5 {
    margin-bottom: 3px;
  }
  .simple {
    ol,
    ul {
      padding-left: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    ul li {
      list-style-type: disc;
      margin-top: 10px;
      & + li {
        margin-top: 5px;
      }
    }
    ol li {
      list-style-type: lower-latin;
      margin-top: 10px;
      & + li {
        margin-top: 5px;
      }
    }
    .services {
      margin: 10px;
      border-collapse: collapse;
      background-color: #fff;
      em {
        display: inline-block;
        width: 90px;
      }
      td,
      th {
        vertical-align: top;
        padding: 5px;
        border: 2px solid #eee;
        &:nth-of-type(1) {
          min-width: 200px;
        }
        &:nth-of-type(2) {
          min-width: 170px;
        }
      }
      th {
        background-color: #eee;
      }
    }
  }
  em {
    margin-right: 7px;
  }
  i::before {
    height: 10px;
    position: relative;
    top: -6px;
  }
}
</style>
