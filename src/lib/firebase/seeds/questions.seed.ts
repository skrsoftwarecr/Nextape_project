import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const seedQuestions = async () => {
  const questionsCol = collection(db, "questions");

  const questions = [
    // SOLID Skill
    {
      skillId: "solid",
      scenario: "Estás desarrollando un sistema de notificaciones. Actualmente tienes una clase 'NotificationManager' que envía emails directamente usando SMTP. Ahora se te pide que el sistema también pueda enviar SMS y Notificaciones Push. ¿Cómo rediseñas la solución?",
      options: {
        bad: "Añado condicionales (if/else) dentro de 'NotificationManager' para verificar el tipo de notificación y escribir el código de envío ahí mismo.",
        acceptable: "Creo métodos separados en 'NotificationManager' (sendEmail, sendSMS, sendPush) y los llamo según corresponda.",
        excellent: "Creo una interfaz 'INotificationProvider' y clases específicas que la implementen (EmailProvider, SMSProvider, PushProvider). Luego inyecto el proveedor correspondiente en 'NotificationManager'."
      },
      approved: true,
      createdAt: serverTimestamp()
    },
    {
      skillId: "solid",
      scenario: "Tienes una clase 'User' que se encarga de almacenar los datos del usuario, guardar en la base de datos y enviar un correo de bienvenida. ¿Qué principio SOLID está violando principalmente y cómo lo solucionas?",
      options: {
        bad: "No viola ningún principio, es mejor tener toda la lógica del usuario en un solo lugar para mayor legibilidad.",
        acceptable: "Viola Open/Closed. Lo soluciono permitiendo heredar de 'User' para sobreescribir cómo se guardan o envían los correos.",
        excellent: "Viola Single Responsibility (SRP). Lo soluciono separando la lógica en 'UserRepository' para la base de datos y 'EmailService' para los correos."
      },
      approved: true,
      createdAt: serverTimestamp()
    },
    {
      skillId: "solid",
      scenario: "Tu aplicación depende de un servicio de procesamiento de pagos 'StripeProcessor'. Si mañana decides cambiar a 'PayPalProcessor', tendrías que modificar mucho código en tu servicio de Checkout. ¿Cómo previenes esto?",
      options: {
        bad: "Añado los dos procesadores al Checkout y uso un flag en la base de datos para decidir cuál ejecutar.",
        acceptable: "Uso una función de fábrica que me devuelva el procesador correcto según la configuración y lo paso al Checkout.",
        excellent: "Aplico Dependency Inversion (DIP). El Checkout debe depender de una abstracción (ej. 'PaymentProcessor') y no de la implementación concreta de Stripe o PayPal."
      },
      approved: true,
      createdAt: serverTimestamp()
    },

    // Testing Skill
    {
      skillId: "testing",
      scenario: "Debes escribir pruebas unitarias para una función que calcula el descuento de un carrito de compras basándose en llamadas a una API externa que consulta el tipo de cambio del día. ¿Cuál es la mejor estrategia?",
      options: {
        bad: "Llamar a la API real en las pruebas y asegurar que la máquina donde se corren tenga internet.",
        acceptable: "Guardar el resultado de la API en caché para que las pruebas sean más rápidas y no consuman cuota de la API.",
        excellent: "Hacer un mock del cliente HTTP o del servicio de tipo de cambio para devolver un valor constante, logrando pruebas predecibles y rápidas."
      },
      approved: true,
      createdAt: serverTimestamp()
    },
    {
      skillId: "testing",
      scenario: "Se ha reportado un bug en producción que solo ocurre bajo una combinación muy específica de datos asíncronos. Tras reproducirlo localmente y encontrar la falla, ¿qué haces primero?",
      options: {
        bad: "Arreglo el código inmediatamente, lo compilo y lo mando a producción para minimizar el impacto.",
        acceptable: "Arreglo el código y luego escribo una prueba E2E (end-to-end) que cubra el flujo principal.",
        excellent: "Escribo una prueba unitaria o de integración que falle demostrando el bug (TDD), luego arreglo el código hasta que la prueba pase."
      },
      approved: true,
      createdAt: serverTimestamp()
    },
    {
      skillId: "testing",
      scenario: "Tu equipo quiere implementar CI/CD, pero la actual suite de pruebas End-to-End (E2E) tarda 45 minutos en correr y frecuentemente falla por timeouts aleatorios (flaky tests).",
      options: {
        bad: "Aumento el tiempo de timeout de las pruebas e ignoro las fallas aleatorias reintentando el pipeline.",
        acceptable: "Paralelizo la ejecución de las pruebas E2E en múltiples contenedores para reducir el tiempo total.",
        excellent: "Reevalúo la pirámide de testing. Muevo la mayoría de las validaciones a pruebas unitarias e integración rápidas, y dejo solo los flujos críticos (happy paths) en las pruebas E2E."
      },
      approved: true,
      createdAt: serverTimestamp()
    }
  ];

  console.log("Iniciando el sembrado de preguntas...");

  for (const q of questions) {
    try {
      const docRef = await addDoc(questionsCol, q);
      console.log(`Pregunta sembrada con ID: ${docRef.id} para el skill: ${q.skillId}`);
    } catch (error) {
      console.error("Error sembrando pregunta:", error);
    }
  }

  console.log("Sembrado completado.");
  process.exit(0);
};

seedQuestions();
