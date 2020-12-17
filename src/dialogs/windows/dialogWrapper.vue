<!--noindex-->Компонент - обертка для всплывающих диалогов<!--/noindex-->
<script>
import Bus from './windowBus';

export default {
    name: 'dialogWrapper',

    data:()=>({
        instance: null,
        cache: null
    }),

    methods:{
        showInstance(instance){
           /* 
            обновить содержимое можно только через дестрой child компонента,
            значит нужно вывод сделать null, потом, после обновления отрисовать
           */
           this.instance = null;
           this.cache = instance;
           this.$forceUpdate()
        }
    },



    render(h){ 
        if(isNullOrUndefined(this.instance))
            return h();

        return  h(this.instance.component, { props: { id: this.instance.id, ...this.instance.props }});
    },

    updated(){
        if(isNullOrUndefined(this.instance) && !isNullOrUndefined(this.cache))
        {
            this.instance = this.cache;
            this.$forceUpdate();
        }
        if(!isNullOrUndefined(this.instance))
            Bus.$emit('InstanceDialogReady', this.instance.id)
    },

    created(){
        Bus.$on('showInstanceDialog', this.showInstance)        
    }
}
</script>