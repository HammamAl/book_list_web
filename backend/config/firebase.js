import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Ganti dengan kredensial Firebase Anda
const serviceAccount = {
  type: "service_account",
  project_id: "book-list-app-684e3",
  private_key_id: "e868cc529d949fd05b931339e743085cff591223",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+Jw94nX9b9o8o\nrP2fMepmHjUtkAYcIScfB99O5K1vGXfFWpBQgvbiDZXobnnIZb3Bz9KiUB3bXQiA\nl8uS51UuM1Xjpys8nauObNFBDXpk03AAGtvJseTmLUSQ1otqA+qzmbdtLRJRJLZf\nQUOOkYZGd5WwXz4Eh7+GubtUjyln3KL5umGod6JZhIETWmahjdVZS37do0IfAOlz\n1Ud01XdOpg2VAy9o32mfosg03yUxmsMUZM/BbLrFWIQASJtxBcmu9rlHuVwpuRhl\nScPLLDRMZ01+chfRW3XCvj5v2+WsdgzBF8tIIYR+EkNFnOI4f6vo6C9WsxUcW08F\nf4hyjsZ1AgMBAAECggEAAZnDPT5Y0nBajNAao8Vqy13uZVTKCGCVu2LN6WnECqRf\nPWUMGUa7nJ7ap9s44TaiCJ30OvOLsiCwBU0XJJnCk3dRKMUWeGsnWjU7nwg7AzBD\nHW0cc9qF1ROFI+b6bh5cUmi1LOZtOguiEV6I8Av04mZNTJpwo4nKU0Wq+FpAJ09Q\nvODNb4YP3O8KFDgNoRUCPMD0Ghg1uj/IX7KGnOk1dulDBxSEKgkr1QIyR+vPEOm1\nuhQw656e2WYKKI5iiVIdXgJXTdyMiCgHJgM7GPofbjAqDOAwdyNTmhl3twSV/gjX\nh4XI0oQ9JC8Qrb3UthEdgJGCxq/VfP9KSKvHZmly4QKBgQD7YQj2LMP9QCPLv3mU\nvvZX1eBENMq2aq9zWfRG/InkUsL4orDBHq4HzceQvZWKiAmfYsQzr3oZlwZRrGcN\nydCMFgMkea+f0ecUM7j3l+WMdh43I/yrL+X+h5kievxJqzBihdfKJOv7cwbgImYA\npjbfal/N9Bnd2dPfxA2XZKN5CQKBgQDBpeZUl+61f1voQMp2GG9HfA9qH/YsNO6j\nqhb/LzaEivDggU5Lsay5wDWSXWnwVMAFUcMasD8ifKRiT+qi+zU7EKga+boL1QIi\nzU9Q0lei5cmEn6U3u2Mt3k2RSkYBMF9j1hi1qtZo0+Gvy5UHDVZ0yABBHpB47Hk6\nX0UM9qHZDQKBgQDXyqXJxgX86cmQx28UbJXGMxiRFIyL6atxp1/WbEXnFdC/ZdG8\nBp04n8LYEpdD06IHC98Hy3RScV4AULIqmPuItgC+mCNWW/c1VW1MRj3MxT0M8ryd\nK8IRLNAdVFws1WL0wJbMtcNKGKVnVMAhgI4MXiGeCBUIaEzEg2Vzd/YJGQKBgFwp\nsAi80rBw7/YGuBUipfuYsOFqWshJXPZp4k4LU2AbnG7NO81Mv48cSqLhcKUgQM+H\nTVsrXLD2L2pW7K4q7vewgsFr7z7oXv7fRguKQIlX4eQL8x8mQRq4faRTfCPeuNeU\nMuhraWY0yWnYc5IKqAYmlfBoMoxKx5ufcgasbvUVAoGAXyQhuQK5Ej+bz/Vnn0CP\nS88sQ3FxOw5sINgR8DLjFZyBtXaNVO+pcft2Hj9Pt188hobhcP5/QRBSSP0MF9Qv\ngG9ovN9Hl/EvDOf+ZTVk8LY+vwdcuAzoHWWX2ruMPak/k4sCP6qqTTrZyMYSTgYK\nMCSF8IsJO1MLRFA/JHKfzu8=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@book-list-app-684e3.iam.gserviceaccount.com",
  client_id: "112824826127399265738",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40book-list-app-684e3.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
