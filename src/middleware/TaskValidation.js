const TaskModel = require("../model/TaskModel");
const { isPast } = require("date-fns");


const TaskValidation = async (req, res, next) => {
  const { macaddress, title, when } = req.body;

  /**
   * Verificação de campos obrigatórios na parte da API
   */
  if (!macaddress) {
    return res
      .status(400)
      .json({ error: "Macaddress é obrigatório para essa solicitação" });
  } else if (!title) {
    return res
      .status(400)
      .json({ error: "Titulo é obrigatório para essa solicitação" });
  } else if (!when) {
    return res
      .status(400)
      .json({ error: "Data e Hora são obrigatórios para essa solicitação" });
  } else {
    /**
     * Verificação de tarefas do Mac, com mesma Data
     * Caso seja um update
     */
    if (req.params.id) {
      exists = await TaskModel.findOne({
        _id: { $ne: req.params.id }, //$ne(not exist)->verifica se existe outra tarefa na mesma data e macaddress
        when: { $eq: new Date(when) },
        macaddress: { $in: macaddress },
      });
    } else {
      /**
       * Verificação de tarefas do Mac, com mesma Data
       * Caso seja um create
       */
      if (isPast(new Date(when))) {
        return res
          .status(400)
          .json({ error: "Data no futuro obrigatória para essa solicitação " });
      }
      exists = await TaskModel.findOne({
        when: { $eq: new Date(when) },
        macaddress: { $in: macaddress },
      });
    }
    if (exists) {
      return res.status(400).json({ error: "task ja cadastrada" });
    }
    next();
  }
};

module.exports = TaskValidation;
