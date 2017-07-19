/**
 * @author rintoj (Rinto Jose)
 * @license The MIT License (MIT)
 *
 * Copyright (c) 2016 rintoj
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the " Software "), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED " AS IS ", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// imports
var fs = require("fs");
var merge = require("merge");
var objectPath = require("object-path");
var PropertiesReader = require('properties-reader');

function processValue(value) {

    if (/^{.+}$/.test((value + "").trim())) {
        return JSON.parse(value);
    }

    return value;
}

/**
 * Read properties and product the nested object structure.
 * 
 * @param propertiesFile Location to the properties file
 * @returns An object with nested properties
 */
module.exports = function propertiesReader(propertiesFile) {

    // application properties
    var properties = {

        load: function (file) {

            var self = this;
            if (!file) {
                return self;
            }

            var extension = file.split(".").slice(-1).join();

            // load '.json' file
            if (extension !== "properties") {
                var content = JSON.parse(fs.readFileSync(file, 'utf-8'));
                self = merge.recursive(self, content);
                return self;
            }

            // read '.properties' file
            var reader = PropertiesReader(file)
            reader.each(function (key, value) {
                if (key === "load") {
                    throw "Configuration can not have a key 'load'!";
                }
                objectPath.set(self, key, processValue(reader.get(key)));
            });

            return self;
        }
    };

    // return the object structure
    return properties.load(propertiesFile);
};