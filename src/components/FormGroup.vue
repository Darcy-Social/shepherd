<template>
  <div class="form-group text-left">
      <label v-if="label.length" :for="id" class="text-sm text-gray-700 dark-mode:text-gray-400" v-html="label"></label>

      <div v-if="type=='toggle'" class="border-gray-900">
        <label class="relative inline-block" v-if="type=='toggle'" style="width: 60px;height: 30px;">
                  <input 
                  @input="$emit('input', $event.target.checked)"
                  :name="name" 
                  :id="id"  
                  class="sr-only toggleInput" 
                  type="checkbox" 
                  :checked="value" >
                  <span class="toggleSlider absolute cursor-pointer bg-gray-500 rounded-full"></span>
          </label>
      </div>

      <div
      v-if="type!='toggle'" 
      class="input-group border rounded-full shadow-sm flex flex-row  bg-white dark-mode:bg-transparent " 
      :class="{'px-2 py-1':(type!='color'),borderClass}"
      :style="{backgroundColor:(type=='color'?value:'')}"
      >
            <input 
                @input="$emit('input', $event.target.value)"
                v-if="type=='text'||type=='password'||type=='file'" class="block w-full dark-mode:bg-transparent" 
                :type="type" 
                :name="name" 
                :id="id" 
                :placeholder="placeholder"
                :value="value"
            />

                  <input 
                    v-if="type=='color'"
                    @input="$emit('input',$event.target.value)"
                    class="block w-full h-8 rounded-full border-none opacity-0 cursor-pointer" 
                    type="color" 
                    :name="name" 
                    :id="id" 
                    :placeholder="placeholder"
                    :value="value"
                  />               
           

            <textarea 
                @input="$emit('input', $event.target.value)"
                v-if="type=='textarea'" 
                class="block w-full dark-mode:bg-transparent" 
                :type="type" 
                :name="name" 
                :id="id" 
                :placeholder="placeholder"
                :value="value"
                rows="2"
               
               style="resize:none;" 
            ></textarea>

            <select @change="onSelectChange($event)" v-if="type=='select'" :name="name" :id="id" class="w-full bg-transparent" >
                <option :selected="value==option.id" v-for="option in options" :key="option.id" :value="option.id">{{option.name}}</option>
            </select>

            

      </div>

      

       <div class="text-danger-500 flex flex-row items-center mt-1" v-if="Object.keys(this.fieldError).length !== 0">
          <span v-html="fieldError.message"></span>
      </div>

     
  </div>
</template>

<script>

export default {
  name: 'FormGroup',

  data: () => ({
  }),
  props: {

    value: {
      String,
      default:""
    },

    type: String,
    status: {
      default: 'grey',
      type: String
    },
    name: String,
    id: String,
    label: {
      default: '',
      type: String
    },
    placeholder: String,
    options: {
      default: () => [],
      type: Array
    },

    message: String,
    messageStatus: String,

    errors: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    fieldError () {
      return this.errors.find(el => el.field === this.name) || {}
    },
    statusClass () {
      if (Object.keys(this.fieldError).length !== 0) { return 'danger' } else { return this.status }
    },
    borderClass(){
      return 'border-'+this.statusClass+'-500'
    },
    sliderValue(){
    }
  },
  methods:{
    onSelectChange(event){
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="css">

.input-group:focus-within {
    @apply border;
    @apply border-primary-300;
    @apply rounded-full;
    box-shadow: 0px 0px 6px 0px rgba(14, 146, 204, 0.75);
}

input:focus,textarea:focus,select:focus{
    outline: none;
}


svg{
    width:100% !important;
}


/* toggle style */

.toggleSlider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.toggleSlider:before {
  @apply rounded-full;
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

.toggleInput:checked + .toggleSlider {
  @apply bg-primary-500;
}

.toggleInput:checked + .toggleSlider:before {
  transform: translateX(30px);
}

</style>