const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    uppercase: true,
    required: [true, "El nombre es requerido"],
    maxlength: 50,
  },
  lastname: {
    type: String,
    uppercase: true,
    required: [true, "El apellido es requerido"],
    maxlength: 50,
  },
  curp: {
    type: String,
    required: [true, "La curp es requerida"],
    uppercase: true,
    validate: {
      validator: function (v) {
        return /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(
          v
        );
      },
      message: (props) => `${props.value} No es una curp valida`,
    },
  },
  create_date: {
    type: Date,
    required: [true, "La fecha es requerida"],
    default: Date.now,
  },
  controlnumber: {
    type: String,
    required: [true, "El número de control es requerido"],
    unique: true,
  },
  grade: {
    type: Number,
    required: [true, "La calificación de control es requerido"],
    min: 0,
    max: 100,
  },
  career: {
    type: String,
    required: [true, "La carrera es requerida"],
    enum: ["ISC", "IM", "IGE", "IC"],
  },
});

const studentModel = mongoose.model("Student", schema, "student");

module.exports = studentModel;
