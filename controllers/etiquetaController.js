const etiquetaService = require('../services/etiquetaService');

/**
 * @swagger
 * /filtertags/{value}:
 *  get:
 *     tags:
 *     - etiquetas
 *     summary: Type Ahead para encontrar tags populares
 *     operationId: filterTags
 *     description: Type Ahead para encontrar tags populares
 *     parameters:
 *     - name: value
 *       type: string
 *       in: path
 *       required: true
 *     responses:
 *       200:
 *         description: Etiquetas Relacionadas
 * 
 */

async function filterTags(req, res) {

    try {
        const tags = await etiquetaService.filterTags(req.params.value)
         return res.status(200).send(tags)
    }
    catch (error){
        console.log(error)
        return res.status(500).send(error.message)
    }
}

/**
 * @swagger
 * /mostUsedTags:
 *  get:
 *     tags:
 *     - etiquetas
 *     summary: Tags más usados
 *     operationId: mostUsedTags
 *     description: Tags más usados
 *     responses:
 *       200:
 *         description: Etiquetas más usadas
 * 
 */

async function mostUsedTags(req, res) {

    try {
        const tags = await etiquetaService.mostUsedTags()
         return res.status(200).send(tags)
    }
    catch (error){
        console.log(error)
        return res.status(500).send(error.message)
    }
}


module.exports = { filterTags, mostUsedTags };