<template>
  <md-dialog>
    <md-dialog-title>Sign in</md-dialog-title>
    This the sign in dialog
    <md-button @click="cancel">Cancel</md-button>
  </md-dialog>
</template>

<script>
export default {
  methods: {
    cancel() {
      this.close();
    }
  }
};
</script>
