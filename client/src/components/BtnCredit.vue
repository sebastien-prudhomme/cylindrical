<template>
  <span>
    <q-btn v-if="$q.screen.gt.xs" :href="href" no-caps padding="xs" type="a">
      <q-chip color="secondary" square text-color="white">
        <q-avatar>
          <img :src="img">
        </q-avatar>
        {{ label }}
      </q-chip>
    </q-btn>
    <q-btn v-if="$q.screen.lt.sm" :href="href" no-caps padding="sm" type="a">
      <q-avatar rounded size="2em" square>
        <img :src="img">
      </q-avatar>
    </q-btn>
  </span>
</template>

<script>
export default {
  name: 'BtnCredit',
  props: {
    href: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  }
}
</script>
