import { assert, expect } from "chai";
import {
  types,
  typeSets,
  extensions,
  getCharset,
  getContentType,
  getExtension,
  getExtensions,
  getMime,
  getMimes,
} from "@whykhamist/mime-types";

describe("MimeTypes ESM (Destructured)", function () {
  describe("getCharset(type)", function () {
    it('should return "UTF-8" for "application/json"', function () {
      assert.strictEqual(getCharset("application/json"), "UTF-8");
    });

    it('should return "UTF-8" for "application/json; foo=bar"', function () {
      assert.strictEqual(getCharset("application/json; foo=bar"), "UTF-8");
    });

    it('should return "UTF-8" for "application/javascript"', function () {
      assert.strictEqual(getCharset("application/javascript"), "UTF-8");
    });

    it('should return "UTF-8" for "application/JavaScript"', function () {
      assert.strictEqual(getCharset("application/JavaScript"), "UTF-8");
    });

    it('should return "UTF-8" for "text/html"', function () {
      assert.strictEqual(getCharset("text/html"), "UTF-8");
    });

    it('should return "UTF-8" for "TEXT/HTML"', function () {
      assert.strictEqual(getCharset("TEXT/HTML"), "UTF-8");
    });

    it('should return "UTF-8" for any text/*', function () {
      assert.strictEqual(getCharset("text/x-bogus"), "UTF-8");
    });

    it("should return false for unknown types", function () {
      assert.strictEqual(getCharset("application/x-bogus"), false);
    });

    it("should return false for any application/octet-stream", function () {
      assert.strictEqual(getCharset("application/octet-stream"), false);
    });

    it("should return false for invalid arguments", function () {
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getCharset({}), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getCharset(null), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getCharset(true), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getCharset(42), false);
    });
  });

  describe("getContentType(extension)", function () {
    it('should return content-type for "html"', function () {
      assert.strictEqual(getContentType("html"), "text/html; charset=utf-8");
    });

    it('should return content-type for ".html"', function () {
      assert.strictEqual(getContentType(".html"), "text/html; charset=utf-8");
    });

    it('should return content-type for "jade"', function () {
      assert.strictEqual(getContentType("jade"), "text/jade; charset=utf-8");
    });

    it('should return content-type for "json"', function () {
      assert.strictEqual(
        getContentType("json"),
        "application/json; charset=utf-8"
      );
    });

    it("should return false for unknown extensions", function () {
      assert.strictEqual(getContentType("bogus"), false);
    });

    it("should return false for invalid arguments", function () {
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getContentType({}), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getContentType(null), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getContentType(true), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getContentType(42), false);
    });
  });

  describe("getContentType(type)", function () {
    it('should attach charset to "application/json"', function () {
      assert.strictEqual(
        getContentType("application/json"),
        "application/json; charset=utf-8"
      );
    });

    it('should attach charset to "application/json; foo=bar"', function () {
      assert.strictEqual(
        getContentType("application/json; foo=bar"),
        "application/json; foo=bar; charset=utf-8"
      );
    });

    it('should attach charset to "TEXT/HTML"', function () {
      assert.strictEqual(
        getContentType("TEXT/HTML"),
        "TEXT/HTML; charset=utf-8"
      );
    });

    it('should attach charset to "text/html"', function () {
      assert.strictEqual(
        getContentType("text/html"),
        "text/html; charset=utf-8"
      );
    });

    it('should not alter "text/html; charset=iso-8859-1"', function () {
      assert.strictEqual(
        getContentType("text/html; charset=iso-8859-1"),
        "text/html; charset=iso-8859-1"
      );
    });

    it("should return type for unknown types", function () {
      assert.strictEqual(
        getContentType("application/x-bogus"),
        "application/x-bogus"
      );
    });
  });

  describe("getExtension(type)", function () {
    it("should return extension for mime type", function () {
      assert.strictEqual(getExtension("text/html"), "html");
      assert.strictEqual(getExtension(" text/html"), "html");
      assert.strictEqual(getExtension("text/html "), "html");
    });

    it("should return false for unknown type", function () {
      assert.strictEqual(getExtension("application/x-bogus"), false);
    });

    it("should return false for non-type string", function () {
      assert.strictEqual(getExtension("bogus"), false);
    });

    it("should return false for non-strings", function () {
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getExtension(null), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getExtension(undefined), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getExtension(42), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getExtension({}), false);
    });

    it("should return extension for mime type with parameters", function () {
      assert.strictEqual(getExtension("text/html;charset=UTF-8"), "html");
      assert.strictEqual(getExtension("text/HTML; charset=UTF-8"), "html");
      assert.strictEqual(getExtension("text/html; charset=UTF-8"), "html");
      assert.strictEqual(getExtension("text/html; charset=UTF-8 "), "html");
      assert.strictEqual(getExtension("text/html ; charset=UTF-8"), "html");
    });
  });

  describe("getExtensions(type)", function () {
    it("should return all extensions for a specific mime type", function () {
      const exts = getExtensions("image/jpeg");

      expect(exts).to.be.an("array", "should be an array");
      expect(exts).to.include("jpg", "should include jpg");
      expect(exts).to.include("jpeg", "should include jpeg");
      expect(exts.length).to.be.greaterThan(0, "should be greater than 0");
    });

    it("should return an empty array for an unknown mime type", function () {
      const exts = getExtensions("application/does-not-exist");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(exts).to.be.an("array").that.is.empty;
    });

    it("should support wildcard mime types", function () {
      const exts = getExtensions("image/*");

      expect(exts).to.be.an("array");
      expect(exts).to.include("jpg");
      expect(exts).to.include("png");
      expect(exts.length).to.be.greaterThan(0);
    });

    it("should normalize mime type (case + parameters)", function () {
      const exts = getExtensions("IMAGE/JPEG; charset=utf-8");
      expect(exts).to.include("jpg");
      expect(exts).to.include("jpeg");
    });

    it("getExtension should still return only the first extension", function () {
      const ext = getExtension("image/jpeg");
      expect(ext).to.be.a("string");
    });

    it("getExtension should support wildcard through getExtensions", function () {
      const ext = getExtension("image/*");
      // can be a string or false
      expect(ext === false || typeof ext === "string").to.equal(true);
    });
  });

  describe("getMime(extension)", function () {
    it('should return mime type for ".html"', function () {
      assert.strictEqual(getMime(".html"), "text/html");
    });

    it('should return mime type for ".js"', function () {
      assert.strictEqual(getMime(".js"), "text/javascript");
    });

    it('should return mime type for ".json"', function () {
      assert.strictEqual(getMime(".json"), "application/json");
    });

    it('should return mime type for ".rtf"', function () {
      assert.strictEqual(getMime(".rtf"), "application/rtf");
    });

    it('should return mime type for ".txt"', function () {
      assert.strictEqual(getMime(".txt"), "text/plain");
    });

    it('should return mime type for ".xml"', function () {
      assert.strictEqual(getMime(".xml"), "application/xml");
    });

    it("should work without the leading dot", function () {
      assert.strictEqual(getMime("html"), "text/html");
      assert.strictEqual(getMime("xml"), "application/xml");
    });

    it("should be case insensitive", function () {
      assert.strictEqual(getMime("HTML"), "text/html");
      assert.strictEqual(getMime(".Xml"), "application/xml");
    });

    it("should return false for unknown extension", function () {
      assert.strictEqual(getMime(".bogus"), false);
      assert.strictEqual(getMime("bogus"), false);
    });

    it("should return false for non-strings", function () {
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMime(null), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMime(undefined), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMime(42), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMime({}), false);
    });
  });

  describe("getMime(path)", function () {
    it("should return mime type for file name", function () {
      assert.strictEqual(getMime("page.html"), "text/html");
    });

    it("should return mime type for relative path", function () {
      assert.strictEqual(getMime("path/to/page.html"), "text/html");
      assert.strictEqual(getMime("path\\to\\page.html"), "text/html");
    });

    it("should return mime type for absolute path", function () {
      assert.strictEqual(getMime("/path/to/page.html"), "text/html");
      assert.strictEqual(getMime("C:\\path\\to\\page.html"), "text/html");
    });

    it("should be case insensitive", function () {
      assert.strictEqual(getMime("/path/to/PAGE.HTML"), "text/html");
      assert.strictEqual(getMime("C:\\path\\to\\PAGE.HTML"), "text/html");
    });

    it("should return false for unknown extension", function () {
      assert.strictEqual(getMime("/path/to/file.bogus"), false);
    });

    it("should return false for path without extension", function () {
      assert.strictEqual(getMime("/path/to/json"), false);
    });

    describe("path with dotfile", function () {
      it("should return false when extension-less", function () {
        assert.strictEqual(getMime("/path/to/json"), false);
      });

      it("should return mime type when there is extension", function () {
        assert.strictEqual(
          getMime("/path/to/.config.json"),
          "application/json"
        );
      });

      it("should return mime type when there is extension, but no path", function () {
        assert.strictEqual(getMime(".config.json"), "application/json");
      });
    });
  });

  describe("getMimes(extension)", function () {
    it("should return array of mime types ", function () {
      assert.sameDeepMembers(getMimes("mp3") as Array<string>, [
        "audio/mpeg",
        "audio/mp3",
      ]);
      assert.sameDeepMembers(getMimes(".rtf") as Array<string>, [
        "application/rtf",
        "text/rtf",
      ]);
      assert.sameDeepMembers(getMimes(".bmp") as Array<string>, [
        "image/x-ms-bmp",
        "image/bmp",
      ]);
    });
  });

  describe("getMimes(path)", function () {
    it("should return array of mime types ", function () {
      assert.sameDeepMembers(getMimes("path/to/file.mp3") as Array<string>, [
        "audio/mpeg",
        "audio/mp3",
      ]);
      assert.sameDeepMembers(getMimes("path\\to\\file.rtf") as Array<string>, [
        "application/rtf",
        "text/rtf",
      ]);
      assert.sameDeepMembers(getMimes("C:/path/to/file.bmp") as Array<string>, [
        "image/x-ms-bmp",
        "image/bmp",
      ]);
    });

    it("should return false when extension-less", function () {
      assert.strictEqual(getMimes("/path/to/json"), false);
    });

    it("should return false for non-strings", function () {
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMimes(null), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMimes(undefined), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMimes(42), false);
      // @ts-expect-error function expects string as param.
      assert.strictEqual(getMimes({}), false);
    });
  });

  describe("properties", function () {
    describe("types", function () {
      it("should return mime type of extension", function () {
        assert.strictEqual(types["mp3"], "audio/mpeg");
      });
    });

    describe("typeSets", function () {
      it("should return set of mime types", function () {
        assert.sameDeepMembers(typeSets["mp3"], ["audio/mpeg", "audio/mp3"]);
      });
    });

    describe("extensions", function () {
      it("should return mime type of extension", function () {
        assert.sameDeepMembers(extensions["text/x-c"], [
          "c",
          "cc",
          "cxx",
          "cpp",
          "h",
          "hh",
          "dic",
        ]);
      });
    });
  });
});
