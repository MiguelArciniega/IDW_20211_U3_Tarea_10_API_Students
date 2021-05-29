const router = require("express").Router();
const mongoose = require("mongoose");
var status = require("http-status");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/student", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Student = require("../models/student.model");

module.exports = () => {
  // * Insertar estudiantes
  router.post("/", (req, res) => {
    student = req.body;

    Student.create(student)
      .then((data) => {
        res.json({
          code: status.OK,
          msg: "Se insertó correctamente",
          data: data,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Ocurrió un error",
          err: err.name,
          detal: err.message,
        });
      });
  });

  // ! Eliminar un estudiante por controlnumber
  router.delete("/:controlnumber", (req, res) => {
    const controlnumber = req.params.controlnumber;

    Student.findOneAndDelete({ controlnumber: controlnumber })
      .then((data) => {
        if (data)
          res.json({
            code: status.OK,
            msg: "Se eliminó correctamente",
            data: data,
          });
        else
          res.status(status.NOT_FOUND).json({
            code: status.NOT_FOUND,
            msg: "No se encontró el elemento",
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Consulta general de estudiantes
  router.get("/", (req, res) => {
    Student.find({})
      .then((data) => {
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: data,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Consulta de estudiantes por controlnumber
  router.get("/:controlnumber", (req, res) => {
    Student.findOne({ controlnumber: req.params.controlnumber })
      .then((student) => {
        if (student)
          res.json({
            code: status.OK,
            msg: "Consulta correcta",
            data: student,
          });
        else
          res.status(status.NOT_FOUND).json({
            code: status.NOT_FOUND,
            msg: "No se encontró el elemento",
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // * Actualizar de estudiantes por controlnumber
  router.put("/:controlnumber", (req, res) => {
    const controlnumber = req.params.controlnumber;
    const student = req.body;

    Student.findOneAndUpdate({ controlnumber: controlnumber }, student, {
      new: true,
    })
      .then((data) => {
        res.json({
          code: status.OK,
          msg: "Se actualizó correctamente",
          data: data,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST);
        res.json({
          code: status.BAD_REQUEST,
          msg: "Error en la aplicación",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Estadistica de estudiantes hombres y mujeres
  router.post("/getMaleAndFemaleByCareer", (req, res) => {
    Student.find({})
      .then((data) => {
        ISCh = 0;
        ISCm = 0;
        IMh = 0;
        IMm = 0;
        IGEh = 0;
        IGEm = 0;
        ICh = 0;
        ICm = 0;

        data.forEach((student, i) => {
          if (data[i].career === "ISC") {
            [...data[i].curp][10] === "M" ? ISCm++ : ISCh++;
          }
          if (data[i].career === "IM") {
            [...data[i].curp][10] === "M" ? IMm++ : IMh++;
          }
          if (data[i].career === "IGE") {
            [...data[i].curp][10] === "M" ? IGEm++ : IGEh++;
          }
          if (data[i].career === "IC") {
            [...data[i].curp][10] === "M" ? ICm++ : ICh++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["Mujeres: " + ISCm, "Hombres: " + ISCh]],
            ["IM", ["Mujeres: " + IMm, "Hombres: " + IMh]],
            ["IGE", ["Mujeres: " + IGEm, "Hombres: " + IGEh]],
            ["IC", ["Mujeres: " + ICm, "Hombres: " + ICh]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Estadistica de estudiantes foraneos
  router.post("/getForaneosByCareer", (req, res) => {
    Student.find({})
      .then((data) => {
        isc = 0;
        im = 0;
        ige = 0;
        ic = 0;

        data.forEach((student, i) => {
          if (data[i].career === "ISC") {
            [...data[i].curp][11] === "N" && [...data[i].curp][12] === "T"
              ? null
              : isc++;
          }
          if (data[i].career === "IM") {
            [...data[i].curp][11] === "N" && [...data[i].curp][12] === "T"
              ? null
              : im++;
          }
          if (data[i].career === "IGE") {
            [...data[i].curp][11] === "N" && [...data[i].curp][12] === "T"
              ? null
              : ige++;
          }
          if (data[i].career === "IC") {
            [...data[i].curp][11] === "N" && [...data[i].curp][12] === "T"
              ? null
              : ic++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["Foraneos: " + isc]],
            ["IM", ["Foraneos: " + im]],
            ["IGE", ["Foraneos: " + ige]],
            ["IC", ["Foraneos: " + ic]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Estadistica de estudiantes aprobados
  router.post("/getAprobadosByCareer", (req, res) => {
    Student.find({})
      .then((data) => {
        iscA = 0;
        imA = 0;
        igeA = 0;
        icA = 0;
        iscR = 0;
        imR = 0;
        igeR = 0;
        icR = 0;

        data.forEach((student, i) => {
          if (data[i].career === "ISC") {
            data[i].grade >= 70 ? iscA++ : iscR++;
          }
          if (data[i].career === "IM") {
            data[i].grade >= 70 ? imA++ : imR++;
          }
          if (data[i].career === "IGE") {
            data[i].grade >= 70 ? igeA++ : igeR++;
          }
          if (data[i].career === "IC") {
            data[i].grade >= 70 ? icA++ : icR++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["Aprobados: " + iscA, "Reprobados: " + iscR]],
            ["IM", ["Aprobados: " + imA, "Reprobados: " + imR]],
            ["IGE", ["Aprobados: " + igeA, "Reprobados: " + igeR]],
            ["IC", ["Aprobados: " + icA, "Reprobados: " + icR]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  // ? Estadistica de estudiantes mayores de edad
  router.post("/getMayoresDeEdadByCareer", (req, res) => {
    Student.find({})
      .then((data) => {
        iscMenor = 0;
        iscMayor = 0;
        imMenor = 0;
        imMayor = 0;
        igeMenor = 0;
        igeMayor = 0;
        icMenor = 0;
        icMayor = 0;

        data.forEach((student, i) => {
          if (data[i].career === "ISC") {
            [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
              ? iscMenor++
              : iscMayor++;
          }
          if (data[i].career === "IM") {
            [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
              ? imMenor++
              : imMayor++;
          }
          if (data[i].career === "IGE") {
            [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
              ? igeMenor++
              : igeMayor++;
          }
          if (data[i].career === "IC") {
            [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
              ? icMenor++
              : icMayor++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            [
              "ISC",
              ["Mayores de edad: " + iscMayor, "Menores de edad: " + iscMenor],
            ],
            [
              "IM",
              ["Mayores de edad: " + imMayor, "Menores de edad: " + imMenor],
            ],
            [
              "IGE",
              ["Mayores de edad: " + igeMayor, "Menores de edad: " + igeMenor],
            ],
            [
              "IC",
              ["Mayores de edad: " + icMayor, "Menores de edad: " + icMenor],
            ],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

  return router;
};
