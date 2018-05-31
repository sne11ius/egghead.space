<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card class="user-details">
          <v-card-title primary-title>
            <h3 class="headline mb-0">{{user.displayName}}</h3>
          </v-card-title>
          <v-card-text>
            <img v-if="user.photoURL" class="avatar" :src="user.photoURL" alt="avatar">
            <v-icon class="avatar" v-else>fas fa-user-circle</v-icon>
            <span class="description">
              {{description}}
            </span>
          </v-card-text>
        </v-card>
        <h4 class="headline">Sketches created by {{user.displayName}}</h4>
        <SketchTiny v-for="sketch of userSketches" :key="sketch.id" :sketch="sketch"></SketchTiny>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-text>
            <v-icon medium class="total-likes-icon">fas fa-heart</v-icon> {{totalLikes}} earned eggs<br>
            From:<br>
            [undisclosed location]<br>
            Joined:<br>
            {{joinedDate}}<br>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SketchTiny from "@/components/SketchTiny.vue";
import { db } from "@/firebase";

const sketches = db.collection("sketches");
const users = db.collection("users");

export default {
  name: "User",
  props: ["uid"],
  components: {
    SketchTiny
  },
  data() {
    return {
      userSketches: [],
      user: {
        displayName: "",
        createdAt: null
      }
    };
  },
  computed: {
    description() {
      if (this.user.description) {
        return this.user.description;
      } else if (
        this.$globals.isAuthenticated &&
        this.$globals.currentUser.uid === this.user.uid
      ) {
        return "Tell people about yourself";
      } else {
        return "This user did not say something about themselves yet.";
      }
    },
    totalLikes() {
      return (
        (this.userSketches.length > 0 &&
          this.userSketches.map(s => s.totalLikes).reduce((a, b) => a + b)) ||
        0
      );
    },
    joinedDate() {
      return "[tbd.]";
    }
  },
  created: function() {
    this.$bind(
      "userSketches",
      sketches.where("createdByUid", "==", this.uid).orderBy("created", "desc")
    );
    this.$bind(
      "user",
      users
        .doc(this.uid)
        .collection("public")
        .doc("userInfo")
    );
  },
  watch: {
    user(user) {
      console.log(user);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-details {
  margin-bottom: 15px;
  .avatar {
    width: 150px;
    vertical-align: top;
    &.fa-user-circle:before {
      font-size: 140px;
    }
  }
  .description {
    position: relative;
    top: 5px;
  }
}
h4.headline {
  font-size: 20px !important;
  margin-top: 30px;
  margin-bottom: 10px;
}
.total-likes-icon {
  margin-right: 10px;
}
</style>
