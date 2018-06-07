<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex class="about-content">
        <h1 class="headline mb-3">Egghead Space</h1>
        <p>
          A place to share project ideas.
        </p>
        <h2 class="headline mb-3">About</h2>
        <p>
          About
        </p>
        <h2 class="headline mb-3">Imprint</h2>
        <p>
          Imprint
        </p>
        <h2 class="headline mb-3">Privacy Policy</h2>
        <p>
          Privacy Policy
        </p>
        <h2 class="headline mb-3">Version</h2>
        <p>
          We are running PHP, Java, Perl, MySQL and Postgres<br>
          Built from branch {{gitBranch}} @ <a :href="commitUrl">{{gitHash}}</a>
        </p>
        <h2 class="headline mb-3">Licenses</h2>
        <p>
          We <v-icon color="accent">fa fa-heart</v-icon> open source.
        </p>
      </v-flex>
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
      gitBranch: __BRANCH_NAME__
    };
  }
};
</script>

<style lang="scss" scoped>
.about-content i::before {
  height: 10px;
  position: relative;
  top: -6px;
}
</style>
