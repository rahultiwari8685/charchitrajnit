import Category from "../models/Category.js";
import slugify from "slugify";
import { TranslationServiceClient } from "@google-cloud/translate";

const SUPPORTED_LANGUAGES = ["en", "hi", "ur", "bn", "mr"];

const getLanguage = (req) => {
  const lang = req.query.lang || "en";

  return SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
};

const CATEGORY_TRANSLATION_TARGETS = ["hi", "ur", "bn", "mr"];

const CATEGORY_TRANSLATION_OVERRIDES = {
  States: {
    hi: "राज्य",
    ur: "ریاستیں",
    bn: "রাজ্যগুলি",
    mr: "राज्ये",
  },

  "Uttar Pradesh": {
    hi: "उत्तर प्रदेश",
    ur: "اتر پردیش",
    bn: "উত্তর প্রদেশ",
    mr: "उत्तर प्रदेश",
  },

  National: {
    hi: "राष्ट्रीय",
    ur: "قومی",
    bn: "জাতীয়",
    mr: "राष्ट्रीय",
  },

  Sports: {
    hi: "खेल",
    ur: "کھیل",
    bn: "খেলাধুলা",
    mr: "खेळ",
  },

  World: {
    hi: "दुनिया",
    ur: "دنیا",
    bn: "বিশ্ব",
    mr: "जग",
  },

  Opinion: {
    hi: "राय",
    ur: "رائے",
    bn: "মতামত",
    mr: "मत",
  },
};

const generateCategoryTranslations = async (name) => {
  if (!name || !name.trim()) {
    return {
      en: {
        name: "",
      },
    };
  }

  const cleanName = name.trim();

  const translations = {
    en: {
      name: cleanName,
    },
  };

  const override = CATEGORY_TRANSLATION_OVERRIDES[cleanName];

  if (override) {
    console.log(`Using custom translation for category: ${cleanName}`);

    for (const target of CATEGORY_TRANSLATION_TARGETS) {
      translations[target] = {
        name: override[target] || "",
      };
    }

    return translations;
  }

  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  if (!projectId) {
    throw new Error("GOOGLE_CLOUD_PROJECT_ID is not configured in .env");
  }

  const translationClient = new TranslationServiceClient();

  for (const target of CATEGORY_TRANSLATION_TARGETS) {
    try {
      console.log(`Translating category: ${cleanName} -> ${target}`);

      const [response] = await translationClient.translateText({
        parent: `projects/${projectId}/locations/global`,

        contents: [cleanName],

        mimeType: "text/plain",

        sourceLanguageCode: "en",

        targetLanguageCode: target,
      });

      translations[target] = {
        name: response?.translations?.[0]?.translatedText || "",
      };

      console.log(
        `Category translation completed: ${cleanName} -> ${target}:`,
        translations[target].name,
      );
    } catch (error) {
      console.error(
        `Category translation failed: ${cleanName} -> ${target}`,
        error?.message || error,
      );

      translations[target] = {
        name: "",
      };
    }
  }

  return translations;
};

// const applyCategoryTranslation = (category, lang = "en") => {
//   const item =
//     typeof category.toObject === "function"
//       ? category.toObject()
//       : { ...category };

//   const translatedName = item.translations?.[lang]?.name?.trim();

//   item.name = translatedName || item.name;

//   return item;
// };

const applyCategoryTranslation = (category, lang = "en") => {
  const item =
    typeof category.toObject === "function"
      ? category.toObject()
      : { ...category };

  // First try database translation
  let translatedName = item.translations?.[lang]?.name?.trim();

  // If Urdu translation doesn't exist in old records,
  // use our predefined translation.
  if (!translatedName && lang !== "en") {
    const englishName =
      item.translations?.en?.name?.trim() || item.name?.trim();

    const override = CATEGORY_TRANSLATION_OVERRIDES[englishName];

    if (override?.[lang]) {
      translatedName = override[lang];
    }
  }

  // Final fallback
  item.name = translatedName || item.translations?.en?.name || item.name;

  return item;
};

export const createCategory = async (req, res) => {
  try {
    let {
      name,
      parentCategory,
      position,
      showInMenu,
      meta_title,
      meta_desc,
      translations,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!parentCategory || parentCategory === "0") {
      parentCategory = null;
    }

    const parsedTranslations = await generateCategoryTranslations(name);

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const category = await Category.create({
      name,
      slug,
      parentCategory,
      meta_title,
      meta_desc,
      translations: parsedTranslations,

      showInMenu:
        showInMenu === "1" ||
        showInMenu === 1 ||
        showInMenu === true ||
        showInMenu === "true"
          ? "1"
          : "0",

      position: Number(position) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name slug translations")
      .sort({ position: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      parentCategory,
      showInMenu,
      position,
      meta_title,
      meta_desc,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID required",
      });
    }

    const updateData = {
      parentCategory:
        !parentCategory || parentCategory === "0" ? null : parentCategory,

      showInMenu:
        showInMenu === "1" ||
        showInMenu === 1 ||
        showInMenu === true ||
        showInMenu === "true"
          ? "1"
          : "0",

      position: Number(position) || 0,

      meta_title: meta_title || "",
      meta_desc: meta_desc || "",
    };

    if (name && name.trim()) {
      updateData.name = name.trim();

      updateData.slug = slugify(name.trim(), {
        lower: true,
        strict: true,
        trim: true,
      });

      updateData.translations = await generateCategoryTranslations(name.trim());
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMenuCategories = async (req, res) => {
  try {
    const lang = getLanguage(req);

    const categories = await Category.find({
      showInMenu: "1",
    })
      .populate("parentCategory", "name slug translations")
      .sort({ position: 1 })
      .select("name slug position parentCategory showInMenu translations");

    const translatedCategories = categories.map((category) => {
      const item = applyCategoryTranslation(category, lang);

      if (item.parentCategory) {
        item.parentCategory = applyCategoryTranslation(
          item.parentCategory,
          lang,
        );
      }

      return item;
    });

    res.status(200).json({
      success: true,
      data: translatedCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
