/**
 * jboss-wfk-quickstarts
 * <p/>
 * Copyright (c) 2015 Jonny Daenen, Hugo Firth & Bas Ketsman
 * Email: <me@hugofirth.com/>
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.quickstarts.wfk.area;

import javax.validation.ValidationException;

/**
 * <p>ValidationException which should be thrown if a non-existant US Area code is provided to AreaService.</p>
 *
 * <p>In such cases the ClientResponse status should be 404 NOT_FOUND.</p>
 *
 * @author hugofirth
 * @see AreaService
 */
public class InvalidAreaCodeException extends ValidationException {

    public InvalidAreaCodeException(Throwable cause) {
        super(cause);
    }

    public InvalidAreaCodeException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidAreaCodeException(String message) {
        super(message);
    }
}
