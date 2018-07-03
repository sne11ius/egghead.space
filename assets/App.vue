<template>
  <v-app>
    <div id="app">
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script>
import Meta from 'mixins/meta'

export default {
  mixins: [Meta],
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
#wait {
  text-align: center;
  padding-top: 30%;
  h3 {
    margin: 0 auto;
    margin-bottom: 1cm;
    font-size: 1cm;
    font-family: "Roboto";
  }
  img {
    max-height: 150px;
  }
}
#app footer {
  width: 100%;
  color: white;
  padding-left: 8px;
  padding-right: 8px;
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .egg {
    height: 20px;
    padding-left: 3px;
    padding-right: 1px;
    position: relative;
    top: 4px;
  }
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
main.content {
  padding-top: 90px !important;
  height: 0;
}
main.content.isHome {
  padding-top: 0px !important;
}
</style>
