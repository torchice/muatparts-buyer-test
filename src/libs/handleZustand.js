class ZustandHandler{
    constructor(zustandState){
        if(!zustandState || typeof zustandState!=='object') throw new Error('salah memasukkan state zustand')
        this.state = zustandState
        this.handleInput = this.handleInput.bind(this);
    }
    handleInput(field,value){
        if(Array.isArray(this.state?.[field])){
            if(!this.state?.[field][0]) {
                let tmp = this.state?.[field]
                tmp.push(value)
                this.state?.setFilterProduct(field,tmp)
                return
            }
            if(typeof this.state?.[field][0]==='string' | typeof this.state?.[field][0]==='number'){
                let tmp = this.state?.[field]
                if(tmp?.some(val=>val===value)){
                    let oldData = tmp?.filter(val=>val!==value)
                    this.state?.setFilterProduct(field,oldData)
                }else this.state?.setFilterProduct(field,[...tmp,value])
                return 
            }
            if(typeof this.state?.[field][0]==='object'){
                let tmp = this.state?.[field]
                if(tmp?.some(val=>val?.id===value?.id)){
                    let oldData = tmp?.filter(val=>val?.id!==value?.id)
                    this.state?.setFilterProduct(field,oldData)
                }else this.state?.setFilterProduct(field,[...tmp,value])
                return 
            }
        }
        if(typeof this.state?.[field]==='string' | typeof this.state?.[field]==='object') this.state?.setFilterProduct(field,value)
    }
}

export default ZustandHandler