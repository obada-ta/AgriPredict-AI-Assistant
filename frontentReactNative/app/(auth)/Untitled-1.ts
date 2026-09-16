 // const handleSubmit = async () => {
  //   if (!selectedAI) return;

  //   setLoading(true);

  //   try {
  //     let payload: any = {};
  //     let headers: any = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // إعداد payload حسب نوع الـ AI
  //     if (image) {
  //       // AI يعتمد على الصور
  //       const formData = new FormData();
  //       formData.append("image", {
  //         uri: image.uri,
  //         name: "photo.jpg",
  //         type: "image/jpeg",
  //       } as any);

  //       Object.keys(inputs).forEach((key) => {
  //         formData.append(key, String(inputs[key]));
  //       });

  //       payload = formData;
  //       headers["Content-Type"] = "multipart/form-data";
  //     } else {
  //       // AI يعتمد على JSON
  //       if (selectedAI === "crop-yield") {
  //         const requiredFields = [
  //           "crop_type", "soil_type", "soil_pH", "temperature",
  //           "humidity", "wind_speed", "N", "P", "K", "soil_quality"
  //         ];

  //         for (const field of requiredFields) {
  //           if (!(field in inputs)) {
  //             throw new Error(`Missing field: ${field}`);
  //           }

  //           // الحقول الرقمية تتحول إلى float
  //           if (!["crop_type", "soil_type"].includes(field)) {
  //             const val = parseFloat(inputs[field] as string);
  //             if (isNaN(val)) throw new Error(`Field ${field} must be a number`);
  //             payload[field] = val;
  //           } else {
  //             // نجعل القيم case-sensitive كما في encoder
  //             payload[field] = String(inputs[field]).trim();
  //           }
  //         }
  //       } else if (selectedAI === "recommend-crop") {
  //         const requiredFields = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"];
  //         requiredFields.forEach((field) => {
  //           if (!(field in inputs)) throw new Error(`Missing field: ${field}`);
  //           const val = parseFloat(inputs[field] as string);
  //           if (isNaN(val)) throw new Error(`Field ${field} must be a number`);
  //           payload[field] = val;
  //         });
  //       } else {
  //         Object.keys(inputs).forEach((key) => payload[key] = inputs[key]);
  //       }

  //       headers["Content-Type"] = "application/json";
  //     }

  //     // تحديد endpoint
  //     let apiUrl = `${BASE_URL}/api/ai/`;
  //     switch (selectedAI) {
  //       case "soil": apiUrl += "soil"; break;
  //       case "plant-disease": apiUrl += "plant-disease"; break;
  //       case "plant-type": apiUrl += "plant"; break;
  //       case "crop-yield": apiUrl += "crop-yield"; break;
  //       case "recommend-crop": apiUrl += "crop"; break;
  //       case "analyze-land": apiUrl += "analyze-land"; break;
  //       default: throw new Error("Invalid AI type");
  //     }

  //     const res = await axios.post(apiUrl, payload, { headers });
  //     setResult(res.data);

  //   } catch (err: any) {
  //     console.error("AI ERROR:", err?.response?.data || err.message);
  //     Alert.alert("Error", err?.response?.data?.error || err.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };