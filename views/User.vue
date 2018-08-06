<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <UserDetails></UserDetails>
        <h4 class="headline">Sketches created by {{userDetails.displayName}}</h4>
        <SketchTiny v-for="sketch of userSketches" :key="sketch.id" :sketch="sketch"></SketchTiny>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-text>
            <v-icon medium class="total-likes-icon">fas fa-heart</v-icon> {{totalLikes}} earned eggs<br>
            <div class="details">
              Joined:<br>
              {{joinedDate}}<br>
            </div>
            <div class="comments">
              <h4 class="headline">Recent comments</h4>
              <div v-if="userComments.length > 0" >
                <Comment v-for="comment in userComments" :comment="comment.ref" :key="comment.ref.id" :showUserLink=false :sketchLink="comment.refString"></Comment>
              </div>
              <span v-else>[No comments yet]</span>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SketchTiny from 'components/SketchTiny.vue'
import Comment from 'components/Comment.vue'
import UserDetails from 'components/UserDetails.vue'
import FirebaseUtil from 'service/FirebaseUtil'
import { api } from 'api'
import { format } from 'date-fns/'

export default {
  name: 'User',
  components: {
    UserDetails,
    SketchTiny,
    Comment
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchUserDetails', route.params.uid)
  },
  computed: {
    userSketches () {
      return this.$store.state.userSketches
    },
    userComments () {
      return this.$store.state.userComments
    },
    userDetails () {
      return this.$store.state.userDetails
    },
    totalLikes () {
      return (
        (this.userSketches.length > 0 &&
          this.userSketches
            .map(s => s.totalLikes || 0)
            .reduce((a, b) => a + b)) ||
        0
      )
    },
    joinedDate () {
      return format(FirebaseUtil.toDate(this.userDetails.createdAt), 'MMMM D. YYYY')
    }
  },
  watch: {
    '$route.params.uid': function (uid) {
      this.$store.dispatch('fetchUserDetails', uid)
    }
  },
  mounted () {
    if (this.isCurrentUser) {
      api
        .fetchPrivateUserData(this.currentUser.uid)
        .then(snapshot => {
          this.privateInfo = snapshot.data()
        })
    }
  }
}
</script>

<style lang="scss">
h4.headline {
  font-size: 20px !important;
  margin-top: 30px;
  margin-bottom: 10px;
}
.total-likes-icon {
  margin-right: 10px;
}
.details {
  margin-top: 15px;
}
.comments {
  margin-top: 15px;
}
</style>
