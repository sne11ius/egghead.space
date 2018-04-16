<template>
  <div>
    <h1>This is a home page</h1>
    <img src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input v-model.trim="newIdeaTitle" @keyup.enter="addIdea" placeholder="Add new idea"><br>
    Here are the ideas:
    <p v-for="idea of ideas" :key="idea.id">
      {{idea.title}}:
      {{idea.content}}<br>
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Firebase from "firebase";
import { db } from "@/firebase";

const ideas = db.collection("ideas");

export default {
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      ideas: [],
      newIdeaTitle: ""
    };
  },
  firestore: {
    ideas: ideas
  },
  methods: {
    addIdea() {
      ideas.add({
        title: this.newIdeaTitle,
        content: "some content",
        created: Firebase.firestore.FieldValue.serverTimestamp()
      });
      this.newIdeaTitle = "";
    }
  }
};
</script>
