/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { assert, expect } = require("chai");
const MTypes = require("@whykhamist/mime-types").default;
const { MimeTypes, MimeDb } = require("@whykhamist/mime-types");

describe("MimeTypes CJS", function () {
  it("should be an instance of MimeTypes", function () {
    assert.instanceOf(new MimeTypes(MimeDb), MimeTypes);
    assert.instanceOf(MTypes, MimeTypes);
  });

  describe(".getCharset(type)", function () {
    it('should return "UTF-8" for "application/json"', function () {
      assert.strictEqual(MTypes.getCharset("application/json"), "UTF-8");
    });

    it('should return "UTF-8" for "application/json; foo=bar"', function () {
      assert.strictEqual(
        MTypes.getCharset("application/json; foo=bar"),
        "UTF-8"
      );
    });

    it('should return "UTF-8" for "application/javascript"', function () {
      assert.strictEqual(MTypes.getCharset("application/javascript"), "UTF-8");
    });

    it('should return "UTF-8" for "application/JavaScript"', function () {
      assert.strictEqual(MTypes.getCharset("application/JavaScript"), "UTF-8");
    });

    it('should return "UTF-8" for "text/html"', function () {
      assert.strictEqual(MTypes.getCharset("text/html"), "UTF-8");
    });

    it('should return "UTF-8" for "TEXT/HTML"', function () {
      assert.strictEqual(MTypes.getCharset("TEXT/HTML"), "UTF-8");
    });

    it('should return "UTF-8" for any text/*', function () {
      assert.strictEqual(MTypes.getCharset("text/x-bogus"), "UTF-8");
    });

    it("should return false for unknown types", function () {
      assert.strictEqual(MTypes.getCharset("application/x-bogus"), false);
    });

    it("should return false for any application/octet-stream", function () {
      assert.strictEqual(MTypes.getCharset("application/octet-stream"), false);
    });

    it("should return false for invalid arguments", function () {
      assert.strictEqual(MTypes.getCharset({}), false);
      assert.strictEqual(MTypes.getCharset(null), false);
      assert.strictEqual(MTypes.getCharset(true), false);
      assert.strictEqual(MTypes.getCharset(42), false);
    });
  });

  describe(".getContentType(extension)", function () {
    it('should return content-type for "html"', function () {
      assert.strictEqual(
        MTypes.getContentType("html"),
        "text/html; charset=utf-8"
      );
    });

    it('should return content-type for ".html"', function () {
      assert.strictEqual(
        MTypes.getContentType(".html"),
        "text/html; charset=utf-8"
      );
    });

    it('should return content-type for "jade"', function () {
      assert.strictEqual(
        MTypes.getContentType("jade"),
        "text/jade; charset=utf-8"
      );
    });

    it('should return content-type for "json"', function () {
      assert.strictEqual(
        MTypes.getContentType("json"),
        "application/json; charset=utf-8"
      );
    });

    it("should return false for unknown extensions", function () {
      assert.strictEqual(MTypes.getContentType("bogus"), false);
    });

    it("should return false for invalid arguments", function () {
      assert.strictEqual(MTypes.getContentType({}), false);
      assert.strictEqual(MTypes.getContentType(null), false);
      assert.strictEqual(MTypes.getContentType(true), false);
      assert.strictEqual(MTypes.getContentType(42), false);
    });
  });

  describe(".getContentType(type)", function () {
    it('should attach charset to "application/json"', function () {
      assert.strictEqual(
        MTypes.getContentType("application/json"),
        "application/json; charset=utf-8"
      );
    });

    it('should attach charset to "application/json; foo=bar"', function () {
      assert.strictEqual(
        MTypes.getContentType("application/json; foo=bar"),
        "application/json; foo=bar; charset=utf-8"
      );
    });

    it('should attach charset to "TEXT/HTML"', function () {
      assert.strictEqual(
        MTypes.getContentType("TEXT/HTML"),
        "TEXT/HTML; charset=utf-8"
      );
    });

    it('should attach charset to "text/html"', function () {
      assert.strictEqual(
        MTypes.getContentType("text/html"),
        "text/html; charset=utf-8"
      );
    });

    it('should not alter "text/html; charset=iso-8859-1"', function () {
      assert.strictEqual(
        MTypes.getContentType("text/html; charset=iso-8859-1"),
        "text/html; charset=iso-8859-1"
      );
    });

    it("should return type for unknown types", function () {
      assert.strictEqual(
        MTypes.getContentType("application/x-bogus"),
        "application/x-bogus"
      );
    });
  });

  describe(".getExtension(type)", function () {
    it("should return extension for mime type", function () {
      assert.strictEqual(MTypes.getExtension("text/html"), "html");
      assert.strictEqual(MTypes.getExtension(" text/html"), "html");
      assert.strictEqual(MTypes.getExtension("text/html "), "html");
    });

    it("should return false for unknown type", function () {
      assert.strictEqual(MTypes.getExtension("application/x-bogus"), false);
    });

    it("should return false for non-type string", function () {
      assert.strictEqual(MTypes.getExtension("bogus"), false);
    });

    it("should return false for non-strings", function () {
      assert.strictEqual(MTypes.getExtension(null), false);

      assert.strictEqual(MTypes.getExtension(undefined), false);

      assert.strictEqual(MTypes.getExtension(42), false);

      assert.strictEqual(MTypes.getExtension({}), false);
    });

    it("should return extension for mime type with parameters", function () {
      assert.strictEqual(
        MTypes.getExtension("text/html;charset=UTF-8"),
        "html"
      );
      assert.strictEqual(
        MTypes.getExtension("text/HTML; charset=UTF-8"),
        "html"
      );
      assert.strictEqual(
        MTypes.getExtension("text/html; charset=UTF-8"),
        "html"
      );
      assert.strictEqual(
        MTypes.getExtension("text/html; charset=UTF-8 "),
        "html"
      );
      assert.strictEqual(
        MTypes.getExtension("text/html ; charset=UTF-8"),
        "html"
      );
    });
  });

  describe("getExtensions(type)", function () {
    it("should return all extensions for a specific mime type", function () {
      const exts = MTypes.getExtensions("image/jpeg");

      expect(exts).to.be.an("array", "should be an array");
      expect(exts).to.include("jpg", "should include jpg");
      expect(exts).to.include("jpeg", "should include jpeg");
      expect(exts.length).to.be.greaterThan(0, "should be greater than 0");
    });

    it("should return an empty array for an unknown mime type", function () {
      const exts = MTypes.getExtensions("application/does-not-exist");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(exts).to.be.an("array").that.is.empty;
    });

    it("should support wildcard mime types", function () {
      const exts = MTypes.getExtensions("image/*");

      expect(exts).to.be.an("array");
      expect(exts).to.include("jpg");
      expect(exts).to.include("png");
      expect(exts.length).to.be.greaterThan(0);
    });

    it("should normalize mime type (case + parameters)", function () {
      const exts = MTypes.getExtensions("IMAGE/JPEG; charset=utf-8");
      expect(exts).to.include("jpg");
      expect(exts).to.include("jpeg");
    });

    it("getExtension should still return only the first extension", function () {
      const ext = MTypes.getExtension("image/jpeg");
      expect(ext).to.be.a("string");
    });

    it("getExtension should support wildcard through getExtensions", function () {
      const ext = MTypes.getExtension("image/*");
      // can be a string or false
      expect(ext === false || typeof ext === "string").to.equal(true);
    });
  });

  describe(".getMime(extension)", function () {
    it('should return mime type for ".html"', function () {
      assert.strictEqual(MTypes.getMime(".html"), "text/html");
    });

    it('should return mime type for ".js"', function () {
      assert.strictEqual(MTypes.getMime(".js"), "text/javascript");
    });

    it('should return mime type for ".json"', function () {
      assert.strictEqual(MTypes.getMime(".json"), "application/json");
    });

    it('should return mime type for ".rtf"', function () {
      assert.strictEqual(MTypes.getMime(".rtf"), "application/rtf");
    });

    it('should return mime type for ".txt"', function () {
      assert.strictEqual(MTypes.getMime(".txt"), "text/plain");
    });

    it('should return mime type for ".xml"', function () {
      assert.strictEqual(MTypes.getMime(".xml"), "application/xml");
    });

    it("should work without the leading dot", function () {
      assert.strictEqual(MTypes.getMime("html"), "text/html");
      assert.strictEqual(MTypes.getMime("xml"), "application/xml");
    });

    it("should be case insensitive", function () {
      assert.strictEqual(MTypes.getMime("HTML"), "text/html");
      assert.strictEqual(MTypes.getMime(".Xml"), "application/xml");
    });

    it("should return false for unknown extension", function () {
      assert.strictEqual(MTypes.getMime(".bogus"), false);
      assert.strictEqual(MTypes.getMime("bogus"), false);
    });

    it("should return false for non-strings", function () {
      assert.strictEqual(MTypes.getMime(null), false);
      assert.strictEqual(MTypes.getMime(undefined), false);
      assert.strictEqual(MTypes.getMime(42), false);
      assert.strictEqual(MTypes.getMime({}), false);
    });
  });

  describe(".getMime(path)", function () {
    it("should return mime type for file name", function () {
      assert.strictEqual(MTypes.getMime("page.html"), "text/html");
    });

    it("should return mime type for relative path", function () {
      assert.strictEqual(MTypes.getMime("path/to/page.html"), "text/html");
      assert.strictEqual(MTypes.getMime("path\\to\\page.html"), "text/html");
    });

    it("should return mime type for absolute path", function () {
      assert.strictEqual(MTypes.getMime("/path/to/page.html"), "text/html");
      assert.strictEqual(
        MTypes.getMime("C:\\path\\to\\page.html"),
        "text/html"
      );
    });

    it("should be case insensitive", function () {
      assert.strictEqual(MTypes.getMime("/path/to/PAGE.HTML"), "text/html");
      assert.strictEqual(
        MTypes.getMime("C:\\path\\to\\PAGE.HTML"),
        "text/html"
      );
    });

    it("should return false for unknown extension", function () {
      assert.strictEqual(MTypes.getMime("/path/to/file.bogus"), false);
    });

    it("should return false for path without extension", function () {
      assert.strictEqual(MTypes.getMime("/path/to/json"), false);
    });

    describe("path with dotfile", function () {
      it("should return false when extension-less", function () {
        assert.strictEqual(MTypes.getMime("/path/to/json"), false);
      });

      it("should return mime type when there is extension", function () {
        assert.strictEqual(
          MTypes.getMime("/path/to/.config.json"),
          "application/json"
        );
      });

      it("should return mime type when there is extension, but no path", function () {
        assert.strictEqual(MTypes.getMime(".config.json"), "application/json");
      });
    });
  });

  describe(".getMimes(extension)", function () {
    it("should return array of mime types ", function () {
      assert.sameDeepMembers(MTypes.getMimes("mp3"), [
        "audio/mpeg",
        "audio/mp3",
      ]);
      assert.sameDeepMembers(MTypes.getMimes(".rtf"), [
        "application/rtf",
        "text/rtf",
      ]);
      assert.sameDeepMembers(MTypes.getMimes(".bmp"), [
        "image/x-ms-bmp",
        "image/bmp",
      ]);
    });
  });

  describe(".getMimes(path)", function () {
    it("should return array of mime types ", function () {
      assert.sameDeepMembers(MTypes.getMimes("path/to/file.mp3"), [
        "audio/mpeg",
        "audio/mp3",
      ]);
      assert.sameDeepMembers(MTypes.getMimes("path\\to\\file.rtf"), [
        "application/rtf",
        "text/rtf",
      ]);
      assert.sameDeepMembers(MTypes.getMimes("c:\\path/to/file.bmp"), [
        "image/x-ms-bmp",
        "image/bmp",
      ]);
    });

    it("should return false when extension-less", function () {
      assert.strictEqual(MTypes.getMimes("/path/to/json"), false);
    });

    it("should return false for non-strings", function () {
      assert.strictEqual(MTypes.getMimes(null), false);
      assert.strictEqual(MTypes.getMimes(undefined), false);
      assert.strictEqual(MTypes.getMimes(42), false);
      assert.strictEqual(MTypes.getMimes({}), false);
    });
  });

  describe("properties", function () {
    describe("types", function () {
      it("should return mime type of extension", function () {
        assert.strictEqual(MTypes.types["mp3"], "audio/mpeg");
      });
    });

    describe("typeSets", function () {
      it("should return set of mime types", function () {
        assert.sameDeepMembers(MTypes.typeSets["mp3"], [
          "audio/mpeg",
          "audio/mp3",
        ]);
      });
    });

    describe("extensions", function () {
      it("should return mime type of extension", function () {
        assert.sameDeepMembers(MTypes.extensions["text/x-c"], [
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
