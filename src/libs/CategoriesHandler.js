class CategoriesHandler {
    constructor(categories) {
        this.categories = categories
    }
    
    generateCategoriesToList(data = this.categories, path = [], level = 1) {
        let result = []
        data.forEach((item, index) => {
          const currentPath = [
            ...path,
            { id: item.id, value: item.value, index, level }
          ]
          result.push(currentPath)
    
          if (item.children) {
            result = result.concat(
              this.generateCategoriesToList(item.children, currentPath, level + 1)
            )
          }
        })
        return result
    }
}

export default CategoriesHandler