<template>
  <div class="dashboard_form">
    <h1>Add Posts</h1>
    <form action="" @submit.prevent="submitHandler">
      <div v-if="imageUpload">
        <img :src="imageUpload" />
      </div>

      <div class="input_field">
        <input type="file" @change="processFile($event)" ref="myFileInput" />
      </div>

      <div class="input_field" :class="{ invalid: $v.formdata.title.$error }">
        <label>Title</label>
        <input
          type="text"
          @blur="$v.formdata.title.$touch()"
          v-model="formdata.title"
        />
        <p class="error_label" v-if="$v.formdata.title.$error">
          This input is required
        </p>
      </div>

      <div class="input_field" :class="{ invalid: $v.formdata.desc.$error }">
        <label>Description</label>
        <input
          type="text"
          @blur="$v.formdata.desc.$touch()"
          v-model="formdata.desc"
        />
        <p class="error_label" v-if="$v.formdata.desc.$error">
          This input is required
        </p>

        <p class="error_label" v-if="!$v.formdata.desc.maxLength">
          Must not be greater than
          {{ $v.formdata.desc.$params.maxLength.max }} characters
        </p>
      </div>

      <div class="input_field">
        <wysiwyg v-model="formdata.content" />
      </div>

      <div class="input_field" :class="{ invalid: $v.formdata.rating.$error }">
        <label>Rating</label>
        <select v-model="formdata.rating" @blur="$v.formdata.rating.$touch()">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <p class="error_label" v-if="$v.formdata.rating.$error">
          You need to select at least one
        </p>
      </div>

      <button type="submit">Add post</button>
    </form>

    <md-dialog :md-active="dialog">
      <p>Your post has no content, are you sure you want to post this?</p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="dialogOnCancel"
          >Oops, I want to add it</md-button
        >
        <md-button class="md-primary" @click="dialogOnConfirm"
          >Yes, I am sure</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <div v-if="addpost" class="post_succesfull">
      Your post was posted succesfully
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      formdata: {
        img: "",
        title: "",
        desc: "",
        content: "",
        rating: ""
      },
      dialog: false
    };
  },
  validations: {
    formdata: {
      title: {
        required
      },
      desc: {
        required,
        maxLength: maxLength(100)
      },
      rating: {
        required
      }
    }
  },
  computed: {
    addpost() {
      let status = this.$store.getters["admin/addPostStatus"];
      if (status) {
        this.clearPost();
        this.$store.commit("admin/clearImageUpload");
      }
      return status;
    },
    imageUpload() {
      let imageUrl = this.$store.getters["admin/imageUpload"];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.formdata.img = imageUrl;
      return imageUrl;
    }
  },
  methods: {
    submitHandler() {
      if (!this.$v.$invalid) {
        if (this.formdata.content === "") {
          //empty => show dialog
          this.dialog = true;
        } else {
          this.addPost();
        }
      } else {
        alert("something is wrong!");
      }
    },
    addPost() {
      this.$store.dispatch("admin/addPost", this.formdata);
    },
    dialogOnCancel() {
      this.dialog = false;
    },
    dialogOnConfirm() {
      this.dialog = false;
      this.addPost();
    },
    clearPost() {
      this.$v.$reset();
      this.$refs.myFileInput.value = "";
      this.formdata = {
        img: "",
        title: "",
        desc: "",
        content: "",
        rating: ""
      };
    },
    processFile(event) {
      let file = event.target.files[0];
      this.$store.dispatch("admin/imageUpload", file);
    }
  },
  destroyed() {
    //life cycle method for the picture
    this.$store.commit("admin/clearImageUpload");
  }
};
</script>

<style scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.input_field.invalid input,
.input_field.invalid select {
  border: 1px solid red;
}
</style>
