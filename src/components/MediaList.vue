<template>
  <div>
    <span v-if="items.length === 0">No images yet</span>
    <v-card v-else v-for="item in items" :key="item.file.id">
      <v-card>
        <img :src="item.previewDownloadUrl">
        <v-card-actions>
          <v-btn @click="$emit('item-clicked', item)">Add to doc</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "MediaList",
  props: {
    items: {
      default: () => {
        return [];
      },
      type: Array
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  max-width: 140px;
}
</style>
