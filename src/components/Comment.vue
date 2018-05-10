<template>
  <div class="comment">
    <div class="comment-body">
      {{comment.body}}
    </div>
    <div class="comment-footer">
      <span class="author-link"><router-link :to="{name: 'user', params: {uid: this.comment.createdByUid, username: linkUsername}}">{{author}}</router-link></span>
      <span class="created">{{creationDate}}</span>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns/";

export default {
  name: "Comment",
  props: ["comment"],
  computed: {
    author() {
      return this.comment.createdBy.displayName;
    },
    linkUsername() {
      return (
        this.comment &&
        this.comment.createdBy &&
        this.comment.createdBy.displayName &&
        this.comment.createdBy.displayName.replace(/\s/g, "+")
      );
    },
    creationDate() {
      if (!(this.comment && this.comment.created)) {
        return "";
      }
      return format(this.comment.created.toDate(), "MMMM D. YYYY HH:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
.comment {
  border-bottom: 1px solid #0a6aa6;
  padding-bottom: 5px;
  & + .comment {
    margin-top: 17px;
  }
  .comment-body {
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .author-link {
    margin-right: 20px;
  }
}
</style>
