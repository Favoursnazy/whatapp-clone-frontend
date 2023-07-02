export const getFileType = (memType) => {
  switch (memType) {
    case "text/plain":
      return "TXT";
    case "application/pdf":
      return "PDF";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    case "application/vnd.ms-powerpoint":
    case "application/powerpoint":
    case "application/mspowerpoint":
    case "application/x-mspowerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PPTX";
    case "application/vnd.ms-excel":
    case "application/x-msexcel":
    case "application/x-excel":
    case "application/excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX";
    case "application/vnd.rar":
      return "RAR";
    case "application/x-zip-compressed":
      return "ZIP";
    case "audion/mpeg":
    case "audio/wav":
      return "AUDIO";
    case "video/mp4":
    case "video/mpeg":
      return "VIDEO";
    default:
      return "IMAGE";
  }
};
