//SendSignDoc - отправка подписb документа во вчасно
// приклади реалізованих функцій
function onTaskExecutePublishProtocol(routeStage) {
  debugger;
  var signatures = [];
  var command;
  if (routeStage.executionResult == "executed") {
    command = "CompleteTask";

    signatures = EdocsApi.getSignaturesAllFiles();
  } else {
    command = "RejectTask";
  }
  var DocCommandData = {};

  DocCommandData.extSysDocID = CurrentDocument.id;
  DocCommandData.extSysDocVersion = CurrentDocument.version;
  DocCommandData.command = command;
  DocCommandData.legalEntityCode = EdocsApi.getAttributeValue("EDRPOUOrg").value;
  DocCommandData.userEmail = EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email;
  DocCommandData.userTitle = CurrentUser.fullName;
  DocCommandData.comment = routeStage.comment;
  DocCommandData.signatures = signatures;

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
    data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: false, // виконувати завдання асинхронно
  };
}

function onTaskExecuteMainTask(routeStage) {
  debugger;
  var signatures = [];
  var command = "RejectTask";
  if (CurrentDocument.inExtId) {
    if (routeStage.executionResult == "rejected") {
      var DocCommandData = {};

      DocCommandData.extSysDocID = CurrentDocument.id;
      DocCommandData.extSysDocVersion = CurrentDocument.version;
      DocCommandData.command = command;
      DocCommandData.legalEntityCode = EdocsApi.getAttributeValue("EDRPOUOrg").value;
      DocCommandData.userEmail = EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email;
      DocCommandData.userTitle = CurrentUser.fullName;
      DocCommandData.comment = routeStage.comment;
      DocCommandData.signatures = signatures;

      routeStage.externalAPIExecutingParams = {
        externalSystemCode: "ESIGN1", // код зовнішньої системи
        externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
        data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
        executeAsync: false, // виконувати завдання асинхронно
      };
    }
  }
}

//Скрипт 2. Зміна властивостей атрибутів при створені документа
//дописати умову створення з есайн
function setInitialRequired() {
  controlRequired("edocsIncomeDocumentNumber");
  controlRequired("edocsIncomeDocumentDate");
  controlRequired("TelephoneContactPerson");
}

function controlRequired(CODE) {
  const control = EdocsApi.EdocsApi.getControlProperties(CODE);
  control.required = true;
  EdocsApi.EdocsApi.getControlProperties(control);
}

function onCardInitialize() {
  setInitialRequired();
}
//edocs
// {
//     "id": 8536,
//     "url": "https://rc-online.e-docs.ua/#!/case/8536",
//     "templateName": "Службова записка на безальтернативну закупівлю",
//     "name": "Службова записка на безальтернативну закупівлю №8536",
//     "initiatorId": 23364,
//     "initiatorName": "Сковорода Г.",
//     "isDraft": true,
//     "executionState": "draft",
//     "created": "2023-08-08T09:42:57.393Z",
//     "version": 0,
//     "inExtId": null,
//     "createdByExtSys": null,
//     "statusName": null,
//     "statusId": null
// }

//esign
// {
//     "id": 8537,
//     "url": "https://rc-online.e-docs.ua/#!/case/8537",
//     "templateName": "Службова записка на безальтернативну закупівлю",
//     "name": "Службова записка на безальтернативну закупівлю №8537",
//     "initiatorId": 23247,
//     "initiatorName": "Мельник І.",
//     "isDraft": true,
//     "executionState": "draft",
//     "created": "2023-08-08T09:48:25.400Z",
//     "version": 0,
//     "inExtId": "09a75d17-d4c6-4d32-8fdf-b33279a1973e",
//     "createdByExtSys": "esign",
//     "statusName": null,
//     "statusId": null
// }
