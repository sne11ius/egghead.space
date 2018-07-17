const description = 'A place to share project ideas'
const keywords = 'egghead.space, egghead, space, sketch, project idea'

const createMeta = route => {
  const defaults = {
    description,
    keywords
  }
  const prefix = 'egghead.space | '
  switch (route.name) {
    case 'Home':
      return {
        title: prefix + 'Home',
        ...defaults
      }
    case 'SketchDetails': {
      const titleSuffix =
        route.params.title && route.params.title !== '' ? ': ' + route.params.title : ''
      return {
        title: prefix + 'Sketch' + titleSuffix.replace(/\+/g, ' '),
        ...defaults
      }
    }
    case 'edit': {
      const titleSuffix =
        route.params.title && route.params.title !== '' ? ': ' + route.params.title : ''
      return {
        title: prefix + 'Sketch' + titleSuffix.replace(/\+/g, ' ') + ' (Edit)',
        ...defaults
      }
    }
    case 'Create':
      return {
        title: prefix + 'Create',
        ...defaults
      }
    case 'About' : {
      const suffix = route.params.show
        ? ' ' + route.params.show[0].toUpperCase() + route.params.show.substring(1)
        : ''
      return {
        title: prefix + 'About' + suffix,
        ...defaults
      }
    }
  }
}

export default {
  watch: {
    $route () {
      this.setMeta()
    }
  },

  created () {
    if (process.env.VUE_ENV === 'client') return

    const metaData = createMeta(this.$route)

    this.$ssrContext.title = metaData.title
    this.$ssrContext.description = metaData.description
    this.$ssrContext.keywords = metaData.keywords
  },

  mounted () {
    this.setMeta()
  },

  methods: {
    setMeta () {
      if (typeof document === 'undefined') return

      const metaData = createMeta(this.$route)

      document.title = metaData.title
      document
        .querySelector('meta[name="description"]')
        .setAttribute('content', metaData.description)
      document.querySelector('meta[name="keywords"]').setAttribute('content', metaData.keywords)
    }
  }
}
