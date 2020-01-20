<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head>Title</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Rating</md-table-head>
        <md-table-head>Action</md-table-head>
      </md-table-row>

      <md-table-row v-for="(post, index) in posts" :key="index">
        <md-table-cell>{{ post.title }}</md-table-cell>
        <md-table-cell>{{ post.desc }} </md-table-cell>
        <md-table-cell>{{ post.rating }}</md-table-cell>
        <md-table-cell>
          <div class="post_delete" @click="deleteJandler(post.id)">Delete</div>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog-confirm
      :md-active.sync="confirmDelete"
      md-title="Confirm delete"
      md-content=" Are you sure you want to delete this post?  "
      md-confirm-text="Yes, delete"
      md-cancel-text="No, don't delete it"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />

    <div class="load_more">
      <app-button type="btn" :addclass="['small_link']" :action="loadMore">
        Load More
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirmDelete: false,
      toDelete: ""
    };
  },
  computed: {
    posts() {
      let posts = this.$store.getters["admin/getAdminPosts"];
      return posts;
    }
  },
  methods: {
    deleteJandler(id) {
      this.toDelete = id;
      this.confirmDelete = true;
    },
    onConfirm() {
      this.$store.dispatch("admin/deletePost", this.toDelete);
      this.confirmDelete = true;
    },
    onCancel() {
      this.toDelete = "";
      this.confirmDelete = false;
    },
    loadMore() {
      this.$store.dispatch("admin/getAdminPosts", {
        limit: this.posts.length + 3
      });
    }
  },
  created() {
    this.$store.dispatch("admin/getAdminPosts", {
      limit: 3
    });
  }
};
</script>
